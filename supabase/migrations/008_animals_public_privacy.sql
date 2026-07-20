-- Public visitors may only see active, public animals.
-- Sensitive sale/death fields remain granted only to authenticated roles.

DROP POLICY IF EXISTS "animals_public_select" ON animals;

CREATE POLICY "animals_public_select"
  ON animals FOR SELECT
  TO anon
  USING (is_public = true AND status = 'active');

-- Prevent anon from selecting internal / commercial columns even when a row matches RLS.
REVOKE SELECT ON animals FROM anon;

GRANT SELECT (
  id,
  tag_number,
  name,
  species,
  breed,
  sex,
  date_of_birth,
  arrival_date,
  current_weight_kg,
  photo_url,
  status,
  is_public,
  created_at,
  updated_at
) ON animals TO anon;

-- Public events must not expose sold/death/status-change timeline rows.
DROP POLICY IF EXISTS "events_public_select" ON events;

CREATE POLICY "events_public_select"
  ON events FOR SELECT
  TO anon
  USING (
    is_public = true
    AND event_type NOT IN ('sold', 'death', 'status_change')
  );
