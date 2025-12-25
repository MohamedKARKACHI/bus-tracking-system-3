-- Update passwords for sample users
-- Password for all users: 'password123'
-- Hash generated using bcrypt with 10 rounds

UPDATE users SET password = '$2b$10$dvUXgyHgYcph791pd32/7eWEs/hXRI8NSUCu52MYcvJn6f9lvYWw6' WHERE email = 'admin@bustrak.com';
UPDATE users SET password = '$2b$10$dvUXgyHgYcph791pd32/7eWEs/hXRI8NSUCu52MYcvJn6f9lvYWw6' WHERE email = 'driver1@bustrak.com';
UPDATE users SET password = '$2b$10$dvUXgyHgYcph791pd32/7eWEs/hXRI8NSUCu52MYcvJn6f9lvYWw6' WHERE email = 'driver2@bustrak.com';
UPDATE users SET password = '$2b$10$dvUXgyHgYcph791pd32/7eWEs/hXRI8NSUCu52MYcvJn6f9lvYWw6' WHERE email = 'client1@example.com';
UPDATE users SET password = '$2b$10$dvUXgyHgYcph791pd32/7eWEs/hXRI8NSUCu52MYcvJn6f9lvYWw6' WHERE email = 'client2@example.com';
