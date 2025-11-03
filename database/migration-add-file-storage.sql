-- Migration: Add file storage fields to apps table
-- Run this in Supabase SQL Editor after running schema.sql
-- This migration is safe to run multiple times (uses IF NOT EXISTS)

-- Add file storage columns to apps table
ALTER TABLE apps 
ADD COLUMN IF NOT EXISTS file_path TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS file_type TEXT CHECK (file_type IN ('apk', 'ipa', 'external') OR file_type IS NULL),
ADD COLUMN IF NOT EXISTS image_path TEXT;

-- Add comment to explain file_type values
COMMENT ON COLUMN apps.file_type IS 'File type: apk (Android), ipa (iOS), or external (external download link)';

-- Add comment for image_path
COMMENT ON COLUMN apps.image_path IS 'Path to uploaded app image in storage bucket app-image';

-- Make download_link nullable since we can now use file uploads
-- This will fail gracefully if already nullable, so we catch and ignore
DO $$ 
BEGIN
    ALTER TABLE apps ALTER COLUMN download_link DROP NOT NULL;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Add constraint: either download_link or file_path must be set
-- Drop constraint if it exists first to avoid errors
DO $$
BEGIN
    ALTER TABLE apps DROP CONSTRAINT IF EXISTS apps_download_required;
    ALTER TABLE apps ADD CONSTRAINT apps_download_required 
    CHECK (download_link IS NOT NULL OR file_path IS NOT NULL);
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

