-- Migration: Add file storage fields to apps table
-- Run this in Supabase SQL Editor after running schema.sql

-- Add file storage columns to apps table
ALTER TABLE apps 
ADD COLUMN IF NOT EXISTS file_path TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS file_type TEXT CHECK (file_type IN ('apk', 'ipa', 'external') OR file_type IS NULL);

-- Add comment to explain file_type values
COMMENT ON COLUMN apps.file_type IS 'File type: apk (Android), ipa (iOS), or external (external download link)';

-- Make download_link nullable since we can now use file uploads
ALTER TABLE apps 
ALTER COLUMN download_link DROP NOT NULL;

-- Add constraint: either download_link or file_path must be set
ALTER TABLE apps 
ADD CONSTRAINT apps_download_required 
CHECK (download_link IS NOT NULL OR file_path IS NOT NULL);

