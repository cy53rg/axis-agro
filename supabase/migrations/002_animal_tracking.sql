-- Animal tracking tables for JRN Agro LTD farm management

-- ─── Types ──────────────────────────────────────────────────────────────────────

CREATE TYPE animal_status AS ENUM ('active', 'sold', 'sick', 'deceased');

CREATE TYPE event_type AS ENUM (
  'birth',
  'arrival',
  'vaccination',
  'health_check',
  'weight_update',
  'status_change',
  'sold',
  'death',
  'other'
);

-- ─── Tables ─────────────────────────────────────────────────────────────────────

CREATE TABLE animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_number TEXT UNIQUE NOT NULL,
  name TEXT,
  species TEXT NOT NULL,
  breed TEXT,
  sex TEXT,
  date_of_birth DATE,
  arrival_date DATE,
  current_weight_kg NUMERIC(8, 2),
  status animal_status NOT NULL DEFAULT 'active',
  photo_url TEXT,
  internal_notes TEXT,
  cause_of_death TEXT,
  sold_to TEXT,
  sold_price NUMERIC(12, 2),
  sold_date DATE,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  weight_kg NUMERIC(8, 2) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  recorded_by UUID REFERENCES auth.users(id),
  notes TEXT
);

CREATE TABLE vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  vaccine_name TEXT NOT NULL,
  date_given DATE NOT NULL,
  next_due_date DATE,
  administered_by TEXT,
  recorded_by UUID REFERENCES auth.users(id)
);

CREATE TABLE health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  check_date DATE NOT NULL,
  findings TEXT,
  vet_name TEXT,
  recorded_by UUID REFERENCES auth.users(id)
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  event_type event_type NOT NULL,
  event_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  recorded_by UUID REFERENCES auth.users(id)
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('insert', 'update', 'delete')),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  before_data JSONB,
  after_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── updated_at triggers ────────────────────────────────────────────────────────

CREATE TRIGGER animals_updated_at
  BEFORE UPDATE ON animals
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ─── Row Level Security ─────────────────────────────────────────────────────────

ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- animals: public read when is_public; authenticated full access
CREATE POLICY "animals_public_select"
  ON animals FOR SELECT
  TO anon
  USING (is_public = true);

CREATE POLICY "animals_authenticated_select"
  ON animals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "animals_authenticated_insert"
  ON animals FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "animals_authenticated_update"
  ON animals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "animals_authenticated_delete"
  ON animals FOR DELETE
  TO authenticated
  USING (true);

-- weight_logs: public read when parent animal is public; authenticated full access
CREATE POLICY "weight_logs_public_select"
  ON weight_logs FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM animals
      WHERE animals.id = weight_logs.animal_id
        AND animals.is_public = true
    )
  );

CREATE POLICY "weight_logs_authenticated_select"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "weight_logs_authenticated_insert"
  ON weight_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "weight_logs_authenticated_update"
  ON weight_logs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "weight_logs_authenticated_delete"
  ON weight_logs FOR DELETE
  TO authenticated
  USING (true);

-- vaccinations: public read when parent animal is public; authenticated full access
CREATE POLICY "vaccinations_public_select"
  ON vaccinations FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM animals
      WHERE animals.id = vaccinations.animal_id
        AND animals.is_public = true
    )
  );

CREATE POLICY "vaccinations_authenticated_select"
  ON vaccinations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "vaccinations_authenticated_insert"
  ON vaccinations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "vaccinations_authenticated_update"
  ON vaccinations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "vaccinations_authenticated_delete"
  ON vaccinations FOR DELETE
  TO authenticated
  USING (true);

-- health_checks: public read when parent animal is public; authenticated full access
CREATE POLICY "health_checks_public_select"
  ON health_checks FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM animals
      WHERE animals.id = health_checks.animal_id
        AND animals.is_public = true
    )
  );

CREATE POLICY "health_checks_authenticated_select"
  ON health_checks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "health_checks_authenticated_insert"
  ON health_checks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "health_checks_authenticated_update"
  ON health_checks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "health_checks_authenticated_delete"
  ON health_checks FOR DELETE
  TO authenticated
  USING (true);

-- events: public read when is_public; authenticated full access
CREATE POLICY "events_public_select"
  ON events FOR SELECT
  TO anon
  USING (is_public = true);

CREATE POLICY "events_authenticated_select"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "events_authenticated_insert"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "events_authenticated_update"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "events_authenticated_delete"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- audit_log: authenticated read/write only; never accessible to anon
CREATE POLICY "audit_log_authenticated_select"
  ON audit_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "audit_log_authenticated_insert"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (true);
