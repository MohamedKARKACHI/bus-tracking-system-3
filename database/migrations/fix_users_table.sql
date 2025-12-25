-- Migration: Remove 'name' column if it exists (or make it nullable)
-- This aligns the database with the Spring Boot entity which uses first_name and last_name

USE bus_tracking_system;

-- Option 1: Make 'name' column nullable or add default value
-- ALTER TABLE users MODIFY COLUMN name VARCHAR(200) DEFAULT '';

-- Option 2: Drop the name column (after migrating data)
-- First, if name has data and first_name/last_name don't:
-- UPDATE users SET first_name = SUBSTRING_INDEX(name, ' ', 1), 
--                  last_name = TRIM(SUBSTRING(name, LOCATE(' ', name)+1))
-- WHERE (first_name IS NULL OR first_name = '') AND name IS NOT NULL AND name != '';

-- Option 3: Add default value to name
ALTER TABLE users MODIFY COLUMN name VARCHAR(200) DEFAULT '';
