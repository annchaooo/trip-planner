-- Add coordinates to activities table for map display
-- Run this in Supabase SQL Editor after the initial schema

ALTER TABLE activities
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add index for location-based queries
CREATE INDEX IF NOT EXISTS idx_activities_coordinates
ON activities(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
