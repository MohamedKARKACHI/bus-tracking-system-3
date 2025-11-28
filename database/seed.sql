-- Sample Data for Bus Tracking System
-- This file populates the database with sample data for testing

USE bus_tracking_system;

-- Insert Sample Users
-- Passwords: admin@bustrack.com = admin123, driver@bustrack.com = driver123, client@bustrack.com = client123
INSERT INTO users (email, password, role, first_name, last_name, phone) VALUES
('admin@bustrack.com', '$2b$10$veZ0rVQYxKZfREzajt0JJe/okGAJXpf5uU4WitvBPQGQdXsoy2hKq', 'admin', 'John', 'Admin', '+1234567890'),
('driver@bustrack.com', '$2b$10$717ZB1aaCQd1iGsIHpTFPukuhMDL.UleFF0Th0sGPbxSYjNp3Bmuq', 'driver', 'Mike', 'Johnson', '+1234567891'),
('driver2@bustrack.com', '$2b$10$717ZB1aaCQd1iGsIHpTFPukuhMDL.UleFF0Th0sGPbxSYjNp3Bmuq', 'driver', 'Sarah', 'Williams', '+1234567892'),
('client@bustrack.com', '$2b$10$er/7RaiQ07yfC34q0xLzYeq4JccfUwhNnihva/BMk8XQ.DMyAG6we', 'client', 'Alice', 'Smith', '+1234567893'),
('client2@bustrack.com', '$2b$10$er/7RaiQ07yfC34q0xLzYeq4JccfUwhNnihva/BMk8XQ.DMyAG6we', 'client', 'Bob', 'Brown', '+1234567894');

-- Insert Sample Drivers
INSERT INTO drivers (user_id, license_number, license_expiry, status, rating, total_trips) VALUES
(2, 'DL123456', '2026-12-31', 'available', 4.75, 150),
(3, 'DL789012', '2027-06-30', 'on_duty', 4.90, 200);

-- Insert Sample Buses
INSERT INTO buses (bus_number, plate_number, model, capacity, year, status, last_maintenance, next_maintenance, fuel_type, current_driver_id) VALUES
('BUS-001', 'ABC-1234', 'Mercedes-Benz Citaro', 45, 2022, 'active', '2025-11-01', '2025-12-01', 'diesel', 1),
('BUS-002', 'XYZ-5678', 'Volvo 7900', 50, 2023, 'active', '2025-11-15', '2025-12-15', 'electric', 2),
('BUS-003', 'DEF-9012', 'MAN Lion\'s City', 48, 2021, 'maintenance', '2025-11-20', '2025-12-20', 'diesel', NULL),
('BUS-004', 'GHI-3456', 'Scania Citywide', 52, 2023, 'active', '2025-11-10', '2025-12-10', 'hybrid', NULL);

-- Insert Sample Routes
INSERT INTO routes (route_number, name, start_location, end_location, distance_km, estimated_duration_minutes, status, fare) VALUES
('R-01', 'City Center - Airport', 'City Center Station', 'International Airport', 25.5, 45, 'active', 5.00),
('R-02', 'North Terminal - University', 'North Terminal', 'State University', 15.0, 30, 'active', 3.50),
('R-03', 'Downtown - Beach', 'Downtown Plaza', 'Beach Resort', 18.5, 35, 'active', 4.00),
('R-04', 'Shopping Mall - Industrial Area', 'Grand Shopping Mall', 'Industrial Park', 22.0, 40, 'active', 4.50);

-- Insert Sample Route Stops for Route 1
INSERT INTO route_stops (route_id, stop_name, stop_order, latitude, longitude, estimated_arrival_time) VALUES
(1, 'City Center Station', 1, 40.7128, -74.0060, '08:00:00'),
(1, 'Main Street', 2, 40.7180, -74.0100, '08:10:00'),
(1, 'Park Avenue', 3, 40.7250, -74.0150, '08:20:00'),
(1, 'Highway Junction', 4, 40.7350, -74.0200, '08:30:00'),
(1, 'International Airport', 5, 40.7500, -74.0300, '08:45:00');

-- Insert Sample Route Stops for Route 2
INSERT INTO route_stops (route_id, stop_name, stop_order, latitude, longitude, estimated_arrival_time) VALUES
(2, 'North Terminal', 1, 40.7600, -74.0400, '09:00:00'),
(2, 'Library Square', 2, 40.7650, -74.0450, '09:10:00'),
(2, 'Medical Center', 3, 40.7700, -74.0500, '09:20:00'),
(2, 'State University', 4, 40.7750, -74.0550, '09:30:00');

-- Insert Sample Schedules
INSERT INTO schedules (route_id, bus_id, driver_id, departure_time, arrival_time, status) VALUES
(1, 1, 1, '2025-11-24 08:00:00', '2025-11-24 08:45:00', 'in_progress'),
(2, 2, 2, '2025-11-24 09:00:00', '2025-11-24 09:30:00', 'scheduled'),
(3, 4, 1, '2025-11-24 10:00:00', '2025-11-24 10:35:00', 'scheduled'),
(1, 1, 1, '2025-11-24 12:00:00', '2025-11-24 12:45:00', 'scheduled');

-- Insert Sample Tickets
INSERT INTO tickets (ticket_number, user_id, schedule_id, seat_number, boarding_stop_id, destination_stop_id, fare, status, payment_status, payment_method) VALUES
('TKT-001-001', 4, 1, 'A12', 1, 5, 5.00, 'confirmed', 'paid', 'card'),
('TKT-001-002', 5, 1, 'B05', 1, 4, 4.00, 'confirmed', 'paid', 'mobile'),
('TKT-002-001', 4, 2, 'C10', 6, 9, 3.50, 'booked', 'pending', 'card');

-- Insert Sample GPS Tracking Data
INSERT INTO gps_tracking (bus_id, schedule_id, latitude, longitude, speed, heading, altitude) VALUES
(1, 1, 40.7128, -74.0060, 45.5, 90.0, 10.0),
(1, 1, 40.7180, -74.0100, 48.0, 92.0, 12.0),
(2, 2, 40.7600, -74.0400, 50.0, 85.0, 15.0);

-- Insert Sample Payments
INSERT INTO payments (ticket_id, amount, payment_method, transaction_id, status) VALUES
(1, 5.00, 'card', 'TXN-2025112401', 'completed'),
(2, 4.00, 'mobile', 'TXN-2025112402', 'completed');

-- Insert Sample Cameras
INSERT INTO cameras (bus_id, camera_type, camera_url, status, installed_date) VALUES
(1, 'front', 'http://camera1.bustrak.com/front', 'active', '2022-01-15'),
(1, 'interior', 'http://camera1.bustrak.com/interior', 'active', '2022-01-15'),
(2, 'front', 'http://camera2.bustrak.com/front', 'active', '2023-03-20'),
(2, 'rear', 'http://camera2.bustrak.com/rear', 'active', '2023-03-20');

-- Insert Sample Messages
INSERT INTO messages (sender_id, receiver_id, subject, message, is_read) VALUES
(1, 2, 'Schedule Update', 'Your schedule for tomorrow has been updated. Please check the dashboard.', FALSE),
(2, 1, 'Vehicle Maintenance', 'BUS-001 needs an oil change soon.', TRUE);

-- Insert Sample Performance Metrics
INSERT INTO performance_metrics (driver_id, schedule_id, on_time_performance, fuel_efficiency, safety_score, customer_rating, date) VALUES
(1, 1, 95.5, 8.2, 98.0, 4.75, '2025-11-24'),
(2, 2, 98.0, 9.5, 99.5, 4.90, '2025-11-24');
