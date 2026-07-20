-- Align profiles.role with worker / manager / owner (safe if 005 already applied with older roles)

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

UPDATE profiles
SET role = CASE role
  WHEN 'admin' THEN 'owner'
  WHEN 'staff' THEN 'manager'
  WHEN 'viewer' THEN 'worker'
  ELSE role
END
WHERE role IN ('admin', 'staff', 'viewer');

ALTER TABLE profiles
  ALTER COLUMN role SET DEFAULT 'worker';

ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('worker', 'manager', 'owner'));

CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'worker')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
