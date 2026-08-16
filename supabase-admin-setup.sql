-- Run this SQL in the Supabase dashboard > SQL Editor
-- https://supabase.com/dashboard/project/qnzyhneecnbovtpwkyfg/sql

-- 1. Login attempts table (rate limiting)
CREATE TABLE IF NOT EXISTS login_attempts (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier  TEXT        NOT NULL,
  success     BOOLEAN     DEFAULT FALSE,
  attempted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_identifier ON login_attempts(identifier);
CREATE INDEX IF NOT EXISTS idx_login_attempts_time      ON login_attempts(attempted_at);

-- Auto-clean attempts older than 1 hour
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '1 hour';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cleanup_login_attempts ON login_attempts;
CREATE TRIGGER trg_cleanup_login_attempts
  AFTER INSERT ON login_attempts
  FOR EACH STATEMENT EXECUTE FUNCTION cleanup_old_login_attempts();

-- 2. Site settings table (about, contact, resume)
CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT        PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('about_bio',       'Product Designer based in Brusque, SC. Six years designing digital products at Havan, the largest retail chain in the South of Brazil.'),
  ('about_photo_url', ''),
  ('contact_email',   'vieiraalencar.neto@gmail.com'),
  ('contact_linkedin','https://linkedin.com/in/uxneto'),
  ('contact_github',  ''),
  ('resume_url',      '')
ON CONFLICT (key) DO NOTHING;

-- 3. Add accent_color column to projects if missing
ALTER TABLE projects ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#fde440';
