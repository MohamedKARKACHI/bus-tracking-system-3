-- Add avatar column to users table for Google OAuth
USE bus_tracking_system;

-- Add avatar column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(500) DEFAULT NULL;

-- Update index if needed
ALTER TABLE users MODIFY COLUMN avatar VARCHAR(500) DEFAULT NULL;
