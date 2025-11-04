-- Migration: Add image_url column to apps table if it doesn't exist
-- This is a quick fix for the "Could not find the 'image_url' column" error
-- Run this in Supabase SQL Editor if you get the schema cache error

-- Add image_url column if it doesn't exist
ALTER TABLE apps 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment
COMMENT ON COLUMN apps.image_url IS 'Public URL to the app image (either from storage or external URL)';

-- Refresh the schema cache (this helps Supabase recognize the new column)
-- Note: This might require a Supabase dashboard refresh or a few minutes
-- You can also try toggling RLS on/off to force a cache refresh:
-- ALTER TABLE apps DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

