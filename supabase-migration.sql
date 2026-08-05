-- =============================================
-- Supabase Database Migration
-- Kelurahan Tiromanda — All Tables
-- =============================================
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Population Stats (single row)
CREATE TABLE IF NOT EXISTS population_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_penduduk INTEGER,
  kepala_keluarga INTEGER,
  luas_wilayah TEXT,
  lingkungan INTEGER DEFAULT 4,
  jumlah_rt INTEGER DEFAULT 8,
  mata_pencaharian TEXT DEFAULT 'Petani',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Gender Composition (single row)
CREATE TABLE IF NOT EXISTS gender_composition (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  laki_laki INTEGER,
  perempuan INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Officials
CREATE TABLE IF NOT EXISTS officials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  position_id TEXT NOT NULL DEFAULT '',
  position_en TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'staff' CHECK (type IN ('lurah', 'staff')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Neighborhoods
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_id TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  head_name TEXT DEFAULT '',
  head_phone TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Neighborhood RTs
CREATE TABLE IF NOT EXISTS neighborhood_rts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  position TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Potentials
CREATE TABLE IF NOT EXISTS potentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  description_id TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  icon TEXT DEFAULT 'FaMapMarkedAlt',
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Facilities
CREATE TABLE IF NOT EXISTS facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_id TEXT NOT NULL DEFAULT '',
  name_en TEXT NOT NULL DEFAULT '',
  description_id TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  location TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Infographics
CREATE TABLE IF NOT EXISTS infographics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT 'community',
  caption_id TEXT DEFAULT '',
  caption_en TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. News
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_id TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  description_id TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  date TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================
-- Enable RLS on all tables
ALTER TABLE population_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE gender_composition ENABLE ROW LEVEL SECURITY;
ALTER TABLE officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_rts ENABLE ROW LEVEL SECURITY;
ALTER TABLE potentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE infographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ access (for the landing page)
CREATE POLICY "Public read access" ON population_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gender_composition FOR SELECT USING (true);
CREATE POLICY "Public read access" ON officials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON neighborhoods FOR SELECT USING (true);
CREATE POLICY "Public read access" ON neighborhood_rts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON potentials FOR SELECT USING (true);
CREATE POLICY "Public read access" ON facilities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON infographics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access" ON news FOR SELECT USING (true);

-- AUTHENTICATED users can INSERT, UPDATE, DELETE (admin dashboard)
CREATE POLICY "Auth insert" ON population_stats FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON population_stats FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON population_stats FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert" ON gender_composition FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON gender_composition FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON gender_composition FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert" ON officials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON officials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON officials FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert" ON neighborhoods FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON neighborhoods FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON neighborhoods FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert" ON neighborhood_rts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON neighborhood_rts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON neighborhood_rts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert" ON potentials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON potentials FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON potentials FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert" ON facilities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON facilities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON facilities FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert" ON infographics FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON infographics FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON infographics FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert" ON gallery FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON gallery FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON gallery FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert" ON news FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update" ON news FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete" ON news FOR DELETE TO authenticated USING (true);

-- =============================================
-- Storage Bucket for Images
-- =============================================
-- Create a public bucket for images (run separately if needed)
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to images bucket
CREATE POLICY "Public image access" ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Auth image upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Auth image delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images');

-- =============================================
-- Seed initial single-row data
-- =============================================
INSERT INTO population_stats (total_penduduk, kepala_keluarga, luas_wilayah, lingkungan, jumlah_rt, mata_pencaharian)
VALUES (NULL, NULL, '5.2 km²', 4, 8, 'Petani');

INSERT INTO gender_composition (laki_laki, perempuan)
VALUES (NULL, NULL);
