# Bus Tracking System Database Setup for MAMP

## Prerequisites
- MAMP installed and running
- MySQL port: 8889 (default MAMP port)
- MySQL credentials: root/root (default MAMP credentials)

## Setup Instructions

### 1. Start MAMP
- Open MAMP application
- Click "Start Servers"
- Ensure both Apache and MySQL are running (green indicators)

### 2. Import Database Schema

#### Option A: Using phpMyAdmin (Recommended)
1. Open phpMyAdmin: http://localhost:8888/phpMyAdmin/
2. Login with username: `root`, password: `root`
3. Click on "Import" tab
4. Choose file: `database/schema.sql`
5. Click "Go" to execute
6. Repeat for `database/seed.sql` to add sample data

#### Option B: Using MySQL Command Line
```bash
# Navigate to MAMP's MySQL bin directory
cd /Applications/MAMP/Library/bin

# Import schema
./mysql -u root -p -P 8889 < /path/to/bus-tracking-system-3/database/schema.sql

# Import seed data
./mysql -u root -p -P 8889 < /path/to/bus-tracking-system-3/database/seed.sql
```

### 3. Configure Environment Variables
The `.env.local` file has been created with MAMP-compatible settings:
```
DATABASE_HOST=localhost
DATABASE_PORT=8889
DATABASE_NAME=bus_tracking_system
DATABASE_USER=root
DATABASE_PASSWORD=root
```

### 4. Verify Database
1. Open phpMyAdmin: http://localhost:8888/phpMyAdmin/
2. Check that `bus_tracking_system` database exists
3. Verify all tables are created:
   - users
   - drivers
   - buses
   - routes
   - route_stops
   - schedules
   - tickets
   - gps_tracking
   - payments
   - incidents
   - cameras
   - messages
   - performance_metrics

## Database Schema Overview

### Main Tables

#### Users
- Stores all system users (admin, drivers, clients)
- Fields: email, password, role, name, phone, etc.

#### Drivers
- Driver-specific information
- Links to users table
- Fields: license_number, status, rating, etc.

#### Buses
- Fleet management
- Fields: bus_number, model, capacity, status, etc.

#### Routes
- Bus routes information
- Fields: route_number, start/end locations, distance, fare, etc.

#### Route Stops
- Individual stops for each route
- Fields: stop_name, coordinates, order, estimated arrival time

#### Schedules
- Trip schedules linking routes, buses, and drivers
- Fields: departure/arrival times, status, etc.

#### Tickets
- Customer bookings
- Fields: ticket_number, seat, fare, payment status, etc.

#### GPS Tracking
- Real-time bus location data
- Fields: latitude, longitude, speed, heading, timestamp

#### Payments
- Payment transactions for tickets
- Fields: amount, method, transaction_id, status

#### Cameras
- Bus camera systems
- Fields: camera_type, url, status

#### Incidents
- Incident reporting and tracking
- Fields: type, severity, description, status

#### Messages
- Internal messaging system
- Fields: sender, receiver, subject, message

#### Performance Metrics
- Driver performance tracking
- Fields: on-time performance, fuel efficiency, ratings

## Sample Data
The `seed.sql` file includes:
- 5 users (1 admin, 2 drivers, 2 clients)
- 4 buses
- 4 routes with stops
- Sample schedules
- Sample tickets and payments
- GPS tracking data
- Camera configurations

## Default Login Credentials (for testing)
- Admin: admin@bustrak.com / password: (hashed)
- Driver 1: driver1@bustrak.com / password: (hashed)
- Driver 2: driver2@bustrak.com / password: (hashed)
- Client 1: client1@example.com / password: (hashed)

Note: Passwords are bcrypt hashed. You'll need to implement proper authentication.

## Troubleshooting

### Can't connect to MySQL
- Verify MAMP is running
- Check port is 8889 (MAMP default)
- Verify credentials: root/root

### Import fails
- Ensure database character set is utf8mb4
- Check MySQL version compatibility
- Review error logs in phpMyAdmin

### Tables not created
- Run schema.sql before seed.sql
- Check for SQL syntax errors
- Ensure proper permissions

## Next Steps
1. Install MySQL2 or Prisma for Node.js database connection
2. Implement API routes for database operations
3. Set up proper authentication and password hashing
4. Configure Mapbox token in `.env.local`
