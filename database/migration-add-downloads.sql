-- Migration: Add downloads column to apps table
-- Run this migration if your apps table already exists and doesn't have the downloads column

-- Add downloads column if it doesn't exist
ALTER TABLE apps 
ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0;

-- Update existing apps with sample download counts if they are 0
UPDATE apps 
SET downloads = CASE 
  WHEN title = 'Productivity Pro' THEN 25000
  WHEN title = 'Photo Editor Plus' THEN 18000
  WHEN title = 'Finance Tracker' THEN 12000
  WHEN title = 'Mindful Meditation' THEN 35000
  WHEN title = 'Language Learner' THEN 42000
  WHEN title = 'Weather Forecast' THEN 15000
  ELSE downloads
END
WHERE downloads = 0 OR downloads IS NULL;

-- Create function to increment app downloads (allows public access without admin permissions)
CREATE OR REPLACE FUNCTION increment_app_downloads(app_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE apps 
  SET downloads = COALESCE(downloads, 0) + 1
  WHERE id = app_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

