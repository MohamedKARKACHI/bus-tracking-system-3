# Bus Tracking System 🚌

A comprehensive full-stack bus tracking and management system with **Next.js 16 frontend** and **Spring Boot 4.0 backend**, featuring real-time GPS tracking, ticket booking, and fleet management.

## Features ✨

- 🗺️ **Real-time bus tracking** with Mapbox GL JS
  - Live GPS updates via Socket.IO (every 5 seconds)
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
- 📱 **Fully responsive design** (Mobile & Desktop optimized)
- 🚦 **Route and schedule management**
- 🔐 **JWT Authentication** with bcrypt password hashing

## Project Structure 📁

```
bus-tracking-system-3/
├── frontend/              # Next.js 16 application (Port 3000)
│   ├── app/              # Next.js app directory
│   │   ├── dashboard/    # Admin dashboard
│   │   ├── driver-portal/ # Driver interface
│   │   └── client-portal/ # Client interface
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...          # Feature components
│   ├── lib/             # Utility functions & contexts
│   ├── hooks/           # Custom React hooks
│   └── public/          # Static assets
│
├── backend/              # Spring Boot REST API (Port 4000)
│   ├── src/main/java/com/bus/backend/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST Controllers
│   │   ├── model/           # JPA Entities
│   │   ├── repository/      # Data Access Layer
│   │   ├── service/         # Business Logic
│   │   ├── security/        # JWT & Auth
│   │   ├── websocket/       # WebSocket handlers
│   │   └── dto/             # Data Transfer Objects
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── build.gradle     # Gradle dependencies
│   └── gradlew          # Gradle wrapper
│
└── database/            # MySQL database files
    ├── schema.sql       # Database schema (13 tables)
    └── seed.sql         # Sample data
```

## Tech Stack 🛠️

### Frontend
- **Framework:** Next.js 16.0.3 with React 19.2.0
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.1.17
- **UI Components:** Radix UI + shadcn/ui
- **Maps:** Mapbox GL JS 3.16.0
- **Real-time:** Socket.IO Client 4.8.1
- **Forms:** React Hook Form with Zod validation
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Framework:** Spring Boot 4.0.0
- **Language:** Java 21
- **Build Tool:** Gradle
- **Database:** MySQL with Spring Data JPA
- **Real-time:** WebSocket (STOMP protocol)
- **Authentication:** Spring Security + JWT
- **Documentation:** SpringDoc OpenAPI (Swagger)

## Prerequisites 📋

- **Frontend:** Node.js 18+ or compatible version, npm
- **Backend:** Java 21 or higher, Gradle (wrapper included)
- **Database:** MAMP (for local MySQL database)
  - Download from: https://www.mamp.info/

## Quick Start 🚀

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd bus-tracking-system-3

# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Setup Database

**Start MAMP and configure:**
- Host: `localhost`
- Port: `8889` (MAMP default MySQL port)
- Username: `root`
- Password: `root`

**Import database:**
1. Start MAMP servers
2. Open phpMyAdmin: http://localhost:8888/phpMyAdmin/
3. Create new database: `bus_tracking_system`
4. Import `database/schema.sql`
5. Import `database/seed.sql`

### 3. Configure Environment Variables

**Frontend** - Create `frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

**Backend** - Already configured in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:8889/bus_tracking_system
spring.datasource.username=root
spring.datasource.password=root
server.port=4000
```

### 4. Start Development Servers

```bash
# Start both frontend and backend together
npm run dev
```

This runs:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Health Check:** http://localhost:4000/health

Visit http://localhost:3000 🎉

## Available Scripts 📜

### Root Directory (Orchestration)
```bash
npm run dev              # Start both frontend and backend concurrently
npm run dev:frontend     # Start frontend only (Next.js on port 3000)
npm run dev:backend      # Start backend only (Express on port 4000)
npm run install:all      # Install dependencies in both folders
```

### Frontend Only (`cd frontend/`)
```bash
npm run dev     # Start Next.js dev server with hot reload
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

### Backend Only (`cd backend/`)
```bash
./gradlew bootRun    # Start Spring Boot with auto-reload
./gradlew build      # Build JAR file
./gradlew test       # Run tests
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar  # Run production
```

## API Endpoints 📡

See complete API documentation in `backend/README.md`

### Quick Reference

**Authentication:**
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/register` - New user registration

**Bus Management:**
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get specific bus
- `POST /api/buses` - Create new bus
- `PUT /api/buses/:id` - Update bus
- `DELETE /api/buses/:id` - Delete bus

**GPS Tracking:**
- `GET /api/gps/latest` - Get latest GPS positions for all buses
- `GET /api/gps/bus/:id/history` - Get GPS history for specific bus
- `POST /api/gps/update` - Update GPS position (emits Socket.IO event)

**Routes & Schedules:**
- `GET /api/routes` - Get all routes
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/bus/:busId` - Get schedules for specific bus

**Incidents & Messages:**
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents` - Report new incident
- `GET /api/messages` - Get messages
- `POST /api/messages` - Send message

## Socket.IO Real-time Events 🔌

### Client → Server
- `subscribe-gps` - Subscribe to GPS updates for all buses
- `track-bus` - Track specific bus by ID
- `untrack-bus` - Stop tracking specific bus

### Server → Client
- `gps-update` - Broadcast GPS positions (every 5 seconds)
- `bus-location` - Specific bus location update

**Example Usage:**
```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

// Subscribe to all GPS updates
socket.emit('subscribe-gps');

// Listen for updates
socket.on('gps-update', (data) => {
  console.log('GPS Update:', data);
});
```

## Database Schema 🗄️

### 13 Tables:

1. **users** - All system users (admin, driver, client)
2. **drivers** - Driver-specific information
3. **buses** - Fleet management data
4. **routes** - Bus routes
5. **route_stops** - Individual stops per route
6. **schedules** - Trip schedules
7. **tickets** - Customer bookings
8. **gps_tracking** - Real-time location data
9. **payments** - Payment transactions
10. **cameras** - Camera systems
11. **incidents** - Incident reporting
12. **messages** - Internal messaging
13. **performance_metrics** - Driver performance tracking

### Sample Data Included:
- 5 users (1 admin, 2 drivers, 2 clients)
- 4 buses with different models
- 4 routes with multiple stops
- Sample schedules and tickets
- GPS tracking data

## User Portals 👥

### Admin Dashboard (`/dashboard`)
- Fleet management and monitoring
- Route configuration
- Driver management
- Analytics and reports
- Camera monitoring
- Payment management
- System settings

### Driver Portal (`/driver-portal`)
- View assigned routes
- Track schedules
- Report incidents
- View performance metrics
- Receive and send messages
- Real-time GPS updates

### Client Portal (`/client-portal`)
- Book tickets online
- View bus schedules
- Track buses in real-time
- Manage bookings
- Payment history
- Route information

## Development 💻

### Project Architecture

The project follows a **client-server architecture** with clear separation:

**Frontend (Next.js):**
- Handles UI/UX and user interactions
- Communicates with backend via REST API
- Real-time updates via Socket.IO client
- Server-side rendering for optimal performance

**Backend (Express):**
- RESTful API for data operations
- Socket.IO server for real-time GPS broadcasting
- JWT authentication middleware
- MySQL connection pooling
- Business logic and data validation

### Adding New Features

1. **Backend:** Add route in `backend/routes/`, update `server.ts`
2. **Frontend:** Create page in `frontend/app/`, add components
3. **Database:** Update `database/schema.sql` if needed
4. **Real-time:** Add Socket.IO events in `backend/socket/`

### Development Workflow

```bash
# 1. Make changes to code
# 2. Both servers auto-reload (tsx watch + Next.js fast refresh)
# 3. Test at http://localhost:3000
# 4. Check backend at http://localhost:4000/health
```

## Troubleshooting 🔧

### Common Issues

**"Cannot connect to backend API"**
- Verify backend is running on port 4000
- Check `NEXT_PUBLIC_BACKEND_URL` in frontend `.env.local`
- Test: `curl http://localhost:4000/health`

**"Database connection failed"**
- Ensure MAMP is running
- Verify MySQL is on port 8889
- Check credentials in `backend/.env`
- Test: `mysql -h localhost -P 8889 -u root -proot -e "SELECT 1;"`

**"Module not found" errors**
- Run `npm run install:all` from root
- Or manually: `cd frontend && npm install && cd ../backend && npm install`

**"Socket.IO not connecting"**
- Check browser console for connection errors
- Verify backend Socket.IO server is running
- Check CORS settings in `backend/server.ts`

### Reset Everything

```bash
# Clean install
rm -rf frontend/node_modules backend/node_modules node_modules
rm -rf frontend/package-lock.json backend/package-lock.json
npm run install:all

# Reset database
# Drop database in phpMyAdmin and re-import schema + seed
```

## Deployment 🚀

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

Update environment variables:
- `NEXT_PUBLIC_BACKEND_URL` → Production backend URL
- `NEXT_PUBLIC_MAPBOX_TOKEN` → Production token

### Backend (Railway/Heroku/DigitalOcean)
```bash
cd backend
npm run build
npm start
```

Update environment variables:
- `DB_HOST`, `DB_PORT`, etc. → Production database
- `JWT_SECRET` → Strong production secret
- `FRONTEND_URL` → Production frontend URL

## Environment Variables Reference 🔐

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
```

### Backend (`.env`)
```env
# Database
DB_HOST=localhost
DB_PORT=8889
DB_USER=root
DB_PASSWORD=root
DB_NAME=bus_tracking_system

# Server
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:3000

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Contributing 🤝

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Submit pull request

## License 📄

This project is for educational purposes.

## Support 💬

For issues and questions:
- Check `backend/README.md` for API documentation
- Check `frontend/README.md` for frontend details
- Review troubleshooting section above
- phpMyAdmin: http://localhost:8888/phpMyAdmin/

---

Built with ❤️ using Next.js 16, Express.js, and MAMP

**Architecture:** Separated frontend/backend for scalability and maintainability
# bus-tracking-system-3
