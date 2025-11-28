# Bus Tracking System 🚌

A comprehensive bus tracking and management system built with Next.js, featuring real-time GPS tracking, ticket booking, and fleet management.

## Features ✨

- 🗺️ **Real-time bus tracking** with Mapbox GL JS
  - Live GPS updates via Socket.IO
  - Interactive map markers with bus details
  - Auto-centering and smooth animations
  - Dark theme optimized maps
- 🎫 **Online ticket booking system**
  - Route selection with visual preview
  - Seat selection interface
  - Payment integration
- 👥 **Multiple user roles** (Admin, Driver, Client)
  - Role-based dashboards
  - Custom navigation and features
- 📊 **Analytics and performance metrics**
  - Real-time fleet statistics
  - Driver performance tracking
- 📹 **Camera monitoring system**
- 💳 **Payment management**
- 📱 **Responsive design**
- 🚦 **Route and schedule management**

## Tech Stack 🛠️

- **Framework:** Next.js 16.0.3 (Turbopack) with React 19.2.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.1.17
- **UI Components:** Radix UI
- **Maps:** Mapbox GL JS 3.16.0
- **Real-time:** Socket.IO 4.8.1
- **Database:** MySQL (MAMP)
- **Authentication:** JWT + bcrypt
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts
- **Icons:** Lucide React

## Prerequisites 📋

- Node.js 18+ or compatible version
- pnpm (recommended) or npm
- MAMP (for local MySQL database)
  - Download from: https://www.mamp.info/

## Quick Start 🚀

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd bus-tracking-system-3

# Install dependencies
pnpm install
```

### 2. Setup Database (Automatic)

**Option A: One-Click Setup (Recommended)**

```bash
# Check if MAMP is running
pnpm check:mamp

# Setup database automatically
pnpm setup:db
```

The script will:
- ✅ Check MAMP connection
- ✅ Create the database schema
- ✅ Import sample data
- ✅ Show confirmation

**Option B: Manual Setup**

If automatic setup doesn't work:

```bash
# 1. Start MAMP
# 2. Open phpMyAdmin: http://localhost:8888/phpMyAdmin/
# 3. Login with: root/root
# 4. Import database/schema.sql
# 5. Import database/seed.sql
```

### 3. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local and add your Mapbox token
# Get token from: https://account.mapbox.com/access-tokens/
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit http://localhost:3000 🎉

## Available Scripts 📜

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database Scripts
pnpm setup:db     # Automatic database setup
pnpm check:mamp   # Check if MAMP is running
pnpm db:schema    # Import schema only
pnpm db:seed      # Import seed data only
```

## Database Setup 🗄️

### MAMP Configuration

- **Host:** localhost
- **Port:** 8889 (MAMP default)
- **Database:** bus_tracking_system
- **Username:** root
- **Password:** root

### Database Schema

The system includes 13 tables:

1. **users** - All system users
2. **drivers** - Driver information
3. **buses** - Fleet management
4. **routes** - Bus routes
5. **route_stops** - Individual stops
6. **schedules** - Trip schedules
7. **tickets** - Customer bookings
8. **gps_tracking** - Real-time location data
9. **payments** - Payment transactions
10. **cameras** - Camera systems
11. **incidents** - Incident reporting
12. **messages** - Internal messaging
13. **performance_metrics** - Driver performance

### Sample Data

The seed file includes:
- 5 users (1 admin, 2 drivers, 2 clients)
- 4 buses with different models
- 4 routes with stops
- Sample schedules and tickets
- GPS tracking data

### Default Login Credentials (Development Only)

```
Admin:
  Email: admin@bustrak.com
  Password: (use hashed password from seed.sql)

Driver:
  Email: driver1@bustrak.com
  Password: (use hashed password from seed.sql)

Client:
  Email: client1@example.com
  Password: (use hashed password from seed.sql)
```

## Project Structure 📁

```
bus-tracking-system-3/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Admin dashboard
│   ├── driver-portal/     # Driver interface
│   ├── client-portal/     # Client interface
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...
├── database/             # Database files
│   ├── schema.sql       # Database schema
│   ├── seed.sql         # Sample data
│   └── README.md        # Database documentation
├── scripts/              # Utility scripts
│   ├── setup-database.js # Auto database setup
│   └── check-mamp.js    # MAMP checker
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── public/               # Static files
```

## User Portals 👥

### Admin Dashboard
- Fleet management
- Route configuration
- Driver management
- Analytics and reports
- Camera monitoring
- Payment management

### Driver Portal
- View assigned routes
- Track schedules
- Report incidents
- View performance metrics
- Receive messages

### Client Portal
- Book tickets
- View schedules
- Track buses in real-time
- Manage bookings
- Payment history

## Troubleshooting 🔧

### Database Connection Issues

```bash
# Check if MAMP is running
pnpm check:mamp

# Verify MAMP MySQL is on port 8889
# Open MAMP > Preferences > Ports

# Test connection manually
/Applications/MAMP/Library/bin/mysql -h localhost -P 8889 -u root -proot -e "SELECT 1;"
```

### Common Issues

**"Cannot connect to MySQL"**
- Ensure MAMP is running
- Check port is 8889 in MAMP preferences
- Verify credentials are root/root

**"Database already exists"**
- This is normal if running setup multiple times
- Drop database in phpMyAdmin if you want fresh install
- Or skip to seed data only: `pnpm db:seed`

**"Module not found"**
- Run `pnpm install` again
- Clear cache: `rm -rf node_modules && pnpm install`

### Reset Database

```bash
# In phpMyAdmin or MySQL CLI:
DROP DATABASE IF EXISTS bus_tracking_system;

# Then run setup again:
pnpm setup:db
```

## Development 💻

### Adding New Features

1. Create components in `components/`
2. Add pages in `app/`
3. Update database schema in `database/schema.sql`
4. Add API routes in `app/api/`

### Database Migrations

When updating the schema:
1. Backup your data
2. Update `database/schema.sql`
3. Update `database/seed.sql` if needed
4. Run `pnpm setup:db` again

## Deployment 🚀

```bash
# Build for production
pnpm build

# Test production build locally
pnpm start
```

For production deployment, you'll need to:
- Setup a production MySQL database
- Update environment variables
- Configure Mapbox token
- Deploy to Vercel, Netlify, or your hosting provider

## Environment Variables 🔐

```env
DATABASE_HOST=localhost
DATABASE_PORT=8889
DATABASE_NAME=bus_tracking_system
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_URL=mysql://root:root@localhost:8889/bus_tracking_system
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

This project is for educational purposes.

## Support 💬

For issues and questions:
- Check the database/README.md for database-specific help
- Review troubleshooting section above
- Check phpMyAdmin at http://localhost:8888/phpMyAdmin/

---

Built with ❤️ using Next.js and MAMP
