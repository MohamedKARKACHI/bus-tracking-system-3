-- Add new route with Bab Doukkala to Bab Agnaou
USE bus_tracking_system;

INSERT INTO routes (route_number, name, start_location, end_location, distance_km, estimated_duration_minutes, status, fare) VALUES
('R-99', 'Bab Doukkala to Bab Agnaou', 'Bab Doukkala', 'Bab Agnaou', 5.0, 20, 'active', 5.00);
