-- Sample Data for Bus Tracking System
-- This file populates the database with sample data for testing

USE bus_tracking_system;

-- Insert Sample Users
-- Passwords: admin@bustrack.com = admin123, driver@bustrack.com = driver123, client@bustrack.com = client123
INSERT INTO users (email, password, role, first_name, last_name, phone) VALUES
('abdellah.h@bustrack.com', '$2b$10$veZ0rVQYxKZfREzajt0JJe/okGAJXpf5uU4WitvBPQGQdXsoy2hKq', 'admin', 'Abdellah', 'Halmaoui', '+212 600 100 200'),
('mohamed.k@bustrack.com', '$2b$10$717ZB1aaCQd1iGsIHpTFPukuhMDL.UleFF0Th0sGPbxSYjNp3Bmuq', 'driver', 'Mohamed', 'Karkachi', '+212 600 000 000'),
('youssef.b@bustrack.com', '$2b$10$717ZB1aaCQd1iGsIHpTFPukuhMDL.UleFF0Th0sGPbxSYjNp3Bmuq', 'driver', 'Youssef', 'Benali', '+212 661 234 567'),
('fatima.a@bustrack.com', '$2b$10$er/7RaiQ07yfC34q0xLzYeq4JccfUwhNnihva/BMk8XQ.DMyAG6we', 'client', 'Fatima Zahra', 'Amrani', '+212 662 345 678'),
('khalid.m@bustrack.com', '$2b$10$er/7RaiQ07yfC34q0xLzYeq4JccfUwhNnihva/BMk8XQ.DMyAG6we', 'client', 'Khalid', 'El Mansouri', '+212 663 456 789'),
('samira.a@bustrack.com', '$2b$10$er/7RaiQ07yfC34q0xLzYeq4JccfUwhNnihva/BMk8XQ.DMyAG6we', 'client', 'Samira', 'Alaoui', '+212 664 567 890'),
('omar.c@bustrack.com', '$2b$10$er/7RaiQ07yfC34q0xLzYeq4JccfUwhNnihva/BMk8XQ.DMyAG6we', 'client', 'Omar', 'Chakib', '+212 665 678 901');

-- Insert Sample Drivers
INSERT INTO drivers (user_id, license_number, license_expiry, status, rating, total_trips) VALUES
(2, 'DL-MA-2024-12345', '2028-12-31', 'on_duty', 4.8, 156),
(3, 'DL-MA-2023-67890', '2027-06-30', 'available', 4.9, 203);

-- Insert Sample Buses
INSERT INTO buses (bus_number, plate_number, model, capacity, year, status, last_maintenance, next_maintenance, fuel_type, current_driver_id) VALUES
('BUS-101', 'A-12345-م', 'Mercedes-Benz Citaro', 45, 2022, 'active', '2025-11-01', '2025-12-01', 'diesel', 1),
('BUS-202', 'B-67890-م', 'Volvo 7900', 50, 2023, 'active', '2025-11-15', '2025-12-15', 'electric', 2),
('BUS-303', 'C-11111-م', 'MAN Lion\'s City', 48, 2021, 'active', '2025-11-20', '2025-12-20', 'diesel', NULL),
('CASA-101', 'D-22222-م', 'Scania Citywide', 52, 2023, 'active', '2025-11-10', '2025-12-10', 'hybrid', NULL),
('TANG-101', 'E-33333-م', 'Iveco Urbanway', 50, 2023, 'active', '2025-11-12', '2025-12-12', 'diesel', NULL),
('IC-TC-01', 'IC-1111-م', 'Volvo 9700', 55, 2024, 'active', '2025-11-05', '2025-12-05', 'diesel', NULL);

-- Insert Sample Routes
INSERT INTO routes (route_number, name, start_location, end_location, distance_km, estimated_duration_minutes, status, fare) VALUES
('R-01', 'Route 1 - Marrakech Express', 'Palmeraie', 'Jemaa el Fna', 12.5, 35, 'active', 8.00),
('R-02', 'Route 2 - Marrakech City', 'Gueliz', 'Hivernage', 8.0, 25, 'active', 6.00),
('R-03', 'Route 3 - Marrakech Loop', 'Massira', 'Koutoubia', 10.5, 30, 'active', 7.00),
('CL-01', 'Casa Line 1', 'Casa Port', 'Morocco Mall', 15.0, 40, 'active', 10.00),
('CL-02', 'Casa Line 2', 'Hassan II Mosque', 'Twin Center', 12.0, 35, 'active', 9.00),
('TL-01', 'Tanger Line 1', 'Port Tanger Med', 'Grand Socco', 8.5, 25, 'active', 6.00),
('TL-02', 'Tanger Line 2', 'Kasbah', 'Ibn Batouta Mall', 11.0, 30, 'active', 7.50),
('IC-01', 'Tanger-Casa Express', 'Port Tanger Med', 'Casa Port', 280.0, 150, 'active', 95.00),
('IC-02', 'Casa-Marrakech Express', 'Maarif', 'Gare ONCF Marrakech', 240.0, 105, 'active', 75.00),
('IC-03', 'Tanger-Marrakech Direct', 'Grand Socco', 'Koutoubia', 520.0, 255, 'active', 120.00);

-- Insert Sample Route Stops for Route 1 (Marrakech)
INSERT INTO route_stops (route_id, stop_name, stop_order, latitude, longitude, estimated_arrival_time) VALUES
(1, 'Palmeraie', 1, 31.6695, -7.9811, '08:00:00'),
(1, 'Gueliz', 2, 31.6500, -7.9900, '08:10:00'),
(1, 'Ben Youssef', 3, 31.6370, -7.9820, '08:20:00'),
(1, 'Koutoubia', 4, 31.6280, -7.9930, '08:30:00'),
(1, 'Jemaa el Fna', 5, 31.6258, -7.9891, '08:35:00');

-- Insert Sample Route Stops for Route 2 (Casa Line 1)
INSERT INTO route_stops (route_id, stop_name, stop_order, latitude, longitude, estimated_arrival_time) VALUES
(4, 'Casa Port', 1, 33.5951, -7.6187, '09:00:00'),
(4, 'Hassan II Mosque', 2, 33.6084, -7.6325, '09:15:00'),
(4, 'Maarif', 3, 33.5731, -7.6289, '09:30:00'),
(4, 'Morocco Mall', 4, 33.5342, -7.6698, '09:40:00');

-- Insert Sample Schedules
INSERT INTO schedules (route_id, bus_id, driver_id, departure_time, arrival_time, status) VALUES
(1, 1, 1, '2025-12-02 08:00:00', '2025-12-02 08:35:00', 'in_progress'),
(4, 4, 2, '2025-12-02 09:00:00', '2025-12-02 09:40:00', 'scheduled'),
(8, 6, 1, '2025-12-02 10:00:00', '2025-12-02 12:30:00', 'scheduled'),
(9, 1, 1, '2025-12-02 14:00:00', '2025-12-02 15:45:00', 'scheduled');

-- Insert Sample Tickets
INSERT INTO tickets (ticket_number, user_id, schedule_id, seat_number, boarding_stop_id, destination_stop_id, fare, status, payment_status, payment_method) VALUES
('TCK-001', 4, 1, 'A12', 1, 5, 8.00, 'confirmed', 'paid', 'card'),
('TCK-002', 5, 3, 'B05', NULL, NULL, 95.00, 'confirmed', 'paid', 'mobile'),
('TCK-003', 6, 4, 'C10', NULL, NULL, 75.00, 'pending', 'pending', 'card'),
('TCK-004', 7, 1, 'A15', 2, 4, 6.00, 'confirmed', 'paid', 'card'),
('TCK-005', 4, 4, 'D08', NULL, NULL, 75.00, 'confirmed', 'paid', 'mobile');

-- Insert Sample GPS Tracking Data
INSERT INTO gps_tracking (bus_id, schedule_id, latitude, longitude, speed, heading, altitude) VALUES
(1, 1, 31.6695, -7.9811, 45.0, 135.0, 450.0),
(1, 1, 31.6500, -7.9900, 42.0, 140.0, 455.0),
(4, 2, 33.5951, -7.6187, 50.0, 180.0, 50.0),
(6, 3, 35.7795, -5.8108, 85.0, 200.0, 120.0);

-- Insert Sample Payments
INSERT INTO payments (ticket_id, amount, payment_method, transaction_id, status) VALUES
(1, 8.00, 'card', 'TXN-2025120201', 'completed'),
(2, 95.00, 'mobile', 'TXN-2025120202', 'completed'),
(4, 6.00, 'card', 'TXN-2025120203', 'completed'),
(5, 75.00, 'mobile', 'TXN-2025120204', 'completed');

-- Insert Sample Cameras
INSERT INTO cameras (bus_id, camera_type, camera_url, status, installed_date) VALUES
(1, 'front', 'http://camera-bus101.morocco-transit.ma/front', 'active', '2022-01-15'),
(1, 'interior', 'http://camera-bus101.morocco-transit.ma/interior', 'active', '2022-01-15'),
(4, 'front', 'http://camera-casa101.morocco-transit.ma/front', 'active', '2023-03-20'),
(4, 'rear', 'http://camera-casa101.morocco-transit.ma/rear', 'active', '2023-03-20'),
(6, 'front', 'http://camera-ictc01.morocco-transit.ma/front', 'active', '2024-01-10'),
(6, 'interior', 'http://camera-ictc01.morocco-transit.ma/interior', 'active', '2024-01-10');

-- Insert Sample Messages
INSERT INTO messages (sender_id, receiver_id, subject, message, is_read) VALUES
(1, 2, 'Route Update - Marrakech', 'Your Route 1 schedule has been updated for tomorrow. Check the dashboard.', FALSE),
(2, 1, 'Vehicle Maintenance', 'BUS-101 requires routine maintenance check next week.', TRUE),
(1, 3, 'New Inter-City Route', 'You have been assigned to the Tanger-Casa Express route starting next week.', FALSE);

-- Insert Sample Performance Metrics
INSERT INTO performance_metrics (driver_id, schedule_id, on_time_performance, fuel_efficiency, safety_score, customer_rating, date) VALUES
(1, 1, 96.5, 8.5, 98.5, 4.8, '2025-12-02'),
(2, 2, 97.0, 9.2, 99.0, 4.9, '2025-12-02');
