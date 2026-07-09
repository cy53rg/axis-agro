-- Run this in your Supabase SQL editor to set up the database

-- ─── Extensions ───────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  caption TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  key_points JSONB NOT NULL DEFAULT '[]',
  icon_name TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_type TEXT NOT NULL,
  quantity TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── updated_at triggers ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ─── Row Level Security ─────────────────────────────────────────────────────────

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- gallery_images: public read; authenticated write
CREATE POLICY "gallery_images_public_select"
  ON gallery_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "gallery_images_authenticated_insert"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "gallery_images_authenticated_update"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "gallery_images_authenticated_delete"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (true);

-- services: public read; authenticated insert/update
CREATE POLICY "services_public_select"
  ON services FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "services_authenticated_insert"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "services_authenticated_update"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- quote_requests: public insert; authenticated read/update
CREATE POLICY "quote_requests_public_insert"
  ON quote_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "quote_requests_authenticated_select"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "quote_requests_authenticated_update"
  ON quote_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- site_content: public read; authenticated insert/update
CREATE POLICY "site_content_public_select"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "site_content_authenticated_insert"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "site_content_authenticated_update"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- site_settings: public read; authenticated insert/update
CREATE POLICY "site_settings_public_select"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "site_settings_authenticated_insert"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "site_settings_authenticated_update"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── Seed: services ─────────────────────────────────────────────────────────────

INSERT INTO services (slug, title, description, key_points, icon_name, display_order)
VALUES
  (
    'cattle-goats',
    'Cattle & Goat Sales',
    'Axis Agro supplies healthy, well-managed cattle and goats from our Kaduna farm. Whether you are stocking a herd, sourcing animals for fattening, or buying for ceremonial or commercial purposes, we provide transparent pricing and guidance on breed selection and care.',
    '[
      "Healthy cattle and goats raised on our Kaduna farm",
      "Breed guidance for commercial, fattening, and ceremonial needs",
      "Transparent pricing with flexible purchase quantities",
      "Support with transport coordination and animal handling advice"
    ]'::jsonb,
    'cow',
    1
  ),
  (
    'poultry',
    'Poultry Products & Supply',
    'From day-old broiler chicks to layers, turkeys, and ducks, Axis Agro is your trusted poultry partner in northern Nigeria. We supply quality birds and practical advice to help smallholders and commercial farmers achieve strong flock performance.',
    '[
      "Broiler chicks, layers, turkeys, and ducks available",
      "Suitable for smallholders and commercial-scale operations",
      "Practical feeding and housing guidance included",
      "Reliable supply from our farm in Kaduna State"
    ]'::jsonb,
    'bird',
    2
  ),
  (
    'farmer-support',
    'Farmer Support & Training',
    'Beyond livestock sales, Axis Agro helps farmers grow with artificial insemination services, hands-on training, and ongoing advisory support. We are committed to building capacity across Kaduna and the wider region.',
    '[
      "Artificial insemination (AI) services for improved genetics",
      "Farmer training on livestock management and best practices",
      "Ongoing advisory support for new and experienced farmers",
      "Practical, field-based learning at our Kaduna facilities"
    ]'::jsonb,
    'graduation-cap',
    3
  );

-- ─── Seed: site_settings ──────────────────────────────────────────────────────

INSERT INTO site_settings (key, value)
VALUES
  ('phone', '+234 800 000 0000'),
  ('email', 'admin@axisagro.ng'),
  ('address', 'Kaduna, Kaduna State, Nigeria'),
  ('whatsapp', '+234 800 000 0000'),
  ('farm_hours', 'Monday – Saturday: 8:00 AM – 5:00 PM'),
  ('facebook_url', 'https://facebook.com/axisagro'),
  ('instagram_url', 'https://instagram.com/axisagro');

-- ─── Seed: site_content ───────────────────────────────────────────────────────

INSERT INTO site_content (key, value)
VALUES
  (
    'home_hero_headline',
    'Quality Livestock. Practical Farming Support. Rooted in Kaduna.'
  ),
  (
    'home_hero_subheading',
    'Axis Agro supplies healthy cattle, goats, and poultry while helping farmers across northern Nigeria grow with training, AI services, and honest advice from our farm.'
  ),
  (
    'about_story',
    'Axis Agro is a Kaduna-based livestock farm built on a simple promise: supply healthy animals and help farmers succeed. From cattle and goat sales to broilers, layers, turkeys, and ducks, we combine practical farm operations with farmer training and artificial insemination services. Whether you are starting out or scaling up, we are here to support you with transparent service and local expertise.'
  ),
  (
    'footer_tagline',
    'Axis Agro — Growing livestock, growing farmers, growing Nigeria.'
  );
