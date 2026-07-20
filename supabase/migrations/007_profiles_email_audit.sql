-- Add email to profiles for audit log actor display

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
  AND (p.email IS NULL OR p.email = '');

CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, email)
  VALUES (NEW.id, 'worker', NEW.email)
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

-- Managers and owners can read all profiles (for audit actor emails)
CREATE POLICY "profiles_select_managers_owners"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM profiles me
      WHERE me.id = auth.uid()
        AND me.role IN ('manager', 'owner')
    )
  );
