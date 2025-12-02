#!/bin/bash

# Morocco Transit Services - Database Reseed Script
# This script drops all data and reseeds with Moroccan names and locations

echo "🇲🇦 Morocco Transit Services - Database Reseed"
echo "================================================"
echo ""

# Database configuration
DB_NAME="bus_tracking_system"
DB_USER="root"
DB_HOST="localhost"
DB_PORT="3306"

echo "⚠️  WARNING: This will delete all existing data!"
echo "Database: $DB_NAME"
echo ""
read -p "Continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]
then
    echo "❌ Aborted."
    exit 1
fi

echo "🗑️  Clearing existing data..."

# Clear all tables in reverse order of dependencies
mysql -u $DB_USER -h $DB_HOST -P $DB_PORT $DB_NAME <<EOF
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE performance_metrics;
TRUNCATE TABLE messages;
TRUNCATE TABLE cameras;
TRUNCATE TABLE payments;
TRUNCATE TABLE gps_tracking;
TRUNCATE TABLE tickets;
TRUNCATE TABLE schedules;
TRUNCATE TABLE route_stops;
TRUNCATE TABLE routes;
TRUNCATE TABLE buses;
TRUNCATE TABLE drivers;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Data cleared successfully"
else
    echo "❌ Error clearing data"
    exit 1
fi

echo ""
echo "📝 Inserting new Moroccan data..."

# Run seed file
mysql -u $DB_USER -h $DB_HOST -P $DB_PORT $DB_NAME < seed.sql

if [ $? -eq 0 ]; then
    echo "✅ Database reseeded successfully!"
    echo ""
    echo "📊 Summary:"
    echo "   - Admin: Abdellah Halmaoui (abdellah.h@bustrack.com)"
    echo "   - Driver: Mohamed Karkachi (mohamed.k@bustrack.com)"
    echo "   - Cities: Marrakech, Casablanca, Tangier"
    echo "   - Routes: 10 total (7 local + 3 inter-city)"
    echo "   - Buses: 6 active buses"
    echo ""
    echo "🔑 Default passwords:"
    echo "   - Admin: admin123"
    echo "   - Driver: driver123"
    echo "   - Clients: client123"
else
    echo "❌ Error inserting data"
    exit 1
fi
