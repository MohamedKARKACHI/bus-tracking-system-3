# Bus Tracking System - Comprehensive Project Analysis

## Executive Summary

This is a full-stack bus tracking and management system built with **Next.js 16** (frontend) and **Express.js** (backend), featuring real-time GPS tracking, ticket booking, and multi-role user management. The system uses **MySQL** (via MAMP) for data persistence and **Socket.IO** for real-time updates.

---

## 1. Project Architecture

### 1.1 Technology Stack

**Frontend:**
- Framework: Next.js 16.0.3 (App Router, Turbopack)
- React: 19.2.0
- TypeScript: 5.x
- Styling: Tailwind CSS 4.1.17
- UI Components: Radix UI primitives
- Maps: Mapbox GL JS 3.4.0
- Real-time: Socket.IO Client 4.8.1
- Forms: React Hook Form + Zod validation
- Charts: Recharts 2.15.4
- Icons: Lucide React

**Backend:**
- Runtime: Node.js with Express.js 4.18.2
- Language: TypeScript
- Database: MySQL 2 (mysql2 3.6.5)
- Real-time: Socket.IO 4.7.2
- Authentication: JWT (jsonwebtoken 9.0.2) + bcryptjs 2.4.3
- CORS: Enabled for cross-origin requests

**Database:**
- MySQL via MAMP (default port 8889)
- Database name: `bus_tracking_system`
- 13 tables with comprehensive relationships

**Development Tools:**
- Package Manager: pnpm (recommended) / npm
- Build Tool: Next.js Turbopack
- TypeScript: Strict mode enabled

---

## 2. Project Structure

```
bus-tracking-system-3/
├── app/                          # Next.js app directory (root level - minimal)
│   ├── api/routes/               # API route handlers
│   └── driver-portal/            # Driver portal layout
│
├── backend/                      # Express.js backend server
│   ├── config/
│   │   └── database.ts           # MySQL connection pool
│   ├── routes/                   # API route handlers
│   │   ├── auth.routes.ts        # Authentication endpoints
│   │   ├── bus.routes.ts         # Bus CRUD operations
│   │   ├── gps.routes.ts         # GPS tracking endpoints
│   │   ├── route.routes.ts       # Route management
│   │   ├── schedule.routes.ts    # Schedule operations
│   │   ├── incident.routes.ts    # Incident reporting
│   │   └── message.routes.ts     # Messaging system
│   ├── socket/
│   │   └── socket-server.ts      # Socket.IO server setup
│   ├── server.ts                 # Express server entry point
│   ├── package.json              # Backend dependencies
│   └── tsconfig.json             # TypeScript config
│
├── frontend/                     # Next.js frontend application
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # Next.js API routes (proxies to backend)
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── buses/            # Bus endpoints
│   │   │   ├── gps/              # GPS endpoints
│   │   │   ├── routes/            # Route endpoints
│   │   │   ├── schedules/        # Schedule endpoints
│   │   │   ├── incidents/        # Incident endpoints
│   │   │   ├── messages/         # Message endpoints
│   │   │   ├── tickets/          # Ticket endpoints
│   │   │   ├── drivers/          # Driver endpoints
│   │   │   ├── analytics/        # Analytics endpoints
│   │   │   └── proxy/            # API proxy utility
│   │   ├── dashboard/            # Admin dashboard
│   │   ├── driver-portal/        # Driver interface
│   │   ├── client-portal/        # Client/passenger interface
│   │   ├── login/                # Login page
│   │   ├── signup/               # Registration page
│   │   ├── tracking/             # Public tracking page
│   │   ├── analytics/            # Analytics dashboard
│   │   ├── fleet/                # Fleet management
│   │   ├── drivers/              # Driver management
│   │   ├── cameras/              # Camera monitoring
│   │   ├── payments/             # Payment management
│   │   ├── notifications/        # Notifications center
│   │   ├── settings/             # Settings page
│   │   ├── book-ticket/          # Ticket booking
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Landing/home page
│   │   └── globals.css           # Global styles
│   │
│   ├── components/               # React components
│   │   ├── ui/                   # Reusable UI components (Radix UI)
│   │   ├── bus-map.tsx           # Bus map wrapper
│   │   ├── mapbox-map.tsx        # Mapbox implementation
│   │   ├── live-map.tsx          # Live tracking map
│   │   ├── live-map-full.tsx     # Full-screen map
│   │   ├── map-view.tsx          # Map view component
│   │   ├── route-progress.tsx    # Route progress indicator
│   │   ├── dashboard-shell.tsx   # Dashboard layout
│   │   ├── dashboard-header.tsx  # Dashboard header
│   │   ├── stats-grid.tsx        # Statistics grid
│   │   ├── fleet-list.tsx        # Fleet listing
│   │   ├── drivers-table.tsx     # Drivers table
│   │   ├── analytics-charts.tsx   # Analytics charts
│   │   ├── ticket-bookings-admin.tsx # Ticket management
│   │   ├── payments-table.tsx    # Payments table
│   │   ├── camera-grid.tsx       # Camera grid view
│   │   ├── driver-portal-sidebar.tsx # Driver sidebar
│   │   ├── client-portal-sidebar.tsx # Client sidebar
│   │   └── landing/              # Landing page components
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── auth.ts               # JWT token utilities
│   │   ├── auth-context.tsx      # Auth context provider
│   │   ├── db.ts                 # Database connection (frontend)
│   │   ├── api.ts                # API request utilities
│   │   ├── api-proxy.ts          # API proxy helper
│   │   ├── bus-data-context.tsx  # Bus data context
│   │   ├── driver-sidebar-context.tsx # Driver sidebar state
│   │   ├── client-sidebar-context.tsx # Client sidebar state
│   │   ├── unified-sidebar-context.tsx # Unified sidebar
│   │   ├── routes-config.ts      # Route configuration
│   │   ├── socket-server.ts      # Socket client setup
│   │   ├── utils.ts              # General utilities
│   │   └── middleware/            # Custom middleware
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-socket.ts         # Socket.IO hook (⚠️ uses STOMP - mismatch)
│   │   ├── use-mobile.ts         # Mobile detection
│   │   └── use-toast.ts          # Toast notifications
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # Shared types/interfaces
│   │
│   ├── middleware.ts             # Next.js middleware (security headers)
│   ├── next.config.mjs           # Next.js configuration
│   ├── tsconfig.json             # TypeScript config
│   └── package.json              # Frontend dependencies
│
├── database/                     # Database files
│   ├── schema.sql               # Complete database schema
│   ├── seed.sql                 # Sample data
│   ├── migrations/               # Database migrations
│   │   └── add_avatar_column.sql
│   ├── create-messages-table.sql
│   └── update-passwords.sql
│
├── scripts/                      # Utility scripts
│   ├── setup-database.js         # Auto database setup
│   ├── check-mamp.js             # MAMP connection checker
│   ├── hash-password.js          # Password hashing utility
│   ├── check-passwords.js        # Password verification
│   ├── test-login.js             # Login testing
│   └── update-users.js           # User update utility
│
├── lib/                          # Shared libraries (root level)
│   └── api-proxy.ts
│
├── package.json                  # Root package.json (orchestration)
├── README.md                     # Main documentation
├── SECURITY.md                   # Security documentation
├── SECURITY_COMPLETE.md          # Security implementation details
├── SECURITY_SUMMARY.md           # Security summary
└── QUICK_SECURITY_REFERENCE.md   # Quick security reference
```

---

## 3. Database Schema Analysis

### 3.1 Tables Overview

The database consists of **13 tables** with the following structure:

1. **users** - User accounts (admin, driver, client)
   - Fields: id, email, password (bcrypt), role, first_name, last_name, phone, is_active
   - Indexes: email, role

2. **drivers** - Driver-specific information
   - Fields: id, user_id (FK), license_number, license_expiry, status, rating, total_trips
   - Relationship: One-to-one with users

3. **buses** - Fleet management
   - Fields: id, bus_number, plate_number, model, capacity, year, status, fuel_type, current_driver_id (FK)
   - Status: active, maintenance, out_of_service

4. **routes** - Bus routes
   - Fields: id, route_number, name, start_location, end_location, distance_km, estimated_duration_minutes, fare, status

5. **route_stops** - Individual stops on routes
   - Fields: id, route_id (FK), stop_name, stop_order, latitude, longitude, estimated_arrival_time

6. **schedules** - Trip schedules
   - Fields: id, route_id (FK), bus_id (FK), driver_id (FK), departure_time, arrival_time, status, actual_departure_time, actual_arrival_time

7. **tickets** - Customer bookings
   - Fields: id, ticket_number, user_id (FK), schedule_id (FK), seat_number, boarding_stop_id (FK), destination_stop_id (FK), fare, status, payment_status, payment_method, qr_code

8. **gps_tracking** - Real-time location data
   - Fields: id, bus_id (FK), schedule_id (FK), latitude, longitude, speed, heading, altitude, timestamp
   - Indexes: bus_id, timestamp (for efficient queries)

9. **payments** - Payment transactions
   - Fields: id, ticket_id (FK), amount, payment_method, transaction_id, status, payment_date

10. **incidents** - Incident reporting
    - Fields: id, bus_id (FK), driver_id (FK), schedule_id (FK), incident_type, description, severity, status, reported_at, resolved_at

11. **cameras** - Camera systems
    - Fields: id, bus_id (FK), camera_type, camera_url, status, installed_date, last_maintenance

12. **messages** - Internal messaging
    - Fields: id, sender_id (FK), receiver_id (FK), subject, message, is_read, sent_at

13. **performance_metrics** - Driver performance tracking
    - Fields: id, driver_id (FK), schedule_id (FK), on_time_performance, fuel_efficiency, safety_score, customer_rating, date

### 3.2 Relationships

- **users** → **drivers** (1:1)
- **users** → **tickets** (1:N)
- **drivers** → **buses** (1:N via current_driver_id)
- **routes** → **route_stops** (1:N)
- **routes** → **schedules** (1:N)
- **buses** → **schedules** (1:N)
- **buses** → **gps_tracking** (1:N)
- **buses** → **cameras** (1:N)
- **schedules** → **tickets** (1:N)
- **tickets** → **payments** (1:1)
- **schedules** → **performance_metrics** (1:N)

### 3.3 Database Configuration

- **Host**: localhost
- **Port**: 8889 (MAMP default)
- **Database**: bus_tracking_system
- **Username**: root
- **Password**: root
- **Connection Pool**: 10 connections max

---

## 4. Backend API Analysis

### 4.1 Server Configuration

**File**: `backend/server.ts`
- Express server on port 4000 (configurable via `BACKEND_PORT`)
- CORS enabled for all origins
- JSON body parsing
- HTTP server created for Socket.IO integration

### 4.2 API Routes

#### Authentication (`/api/auth`)
- `POST /api/auth/login` - User login with email/password
  - Returns: JWT token + user object
  - Password verification via bcrypt
- `POST /api/auth/register` - User registration
  - Creates new user with hashed password
  - Returns: JWT token + user object

**Issues Found:**
- Login route references `user.name` but schema uses `first_name` and `last_name`
- Register route uses `name` field which doesn't exist in schema

#### Buses (`/api/buses`)
- `GET /api/buses` - Get all buses with driver and route info
- `GET /api/buses/:id` - Get single bus
- `POST /api/buses` - Create new bus
- `PUT /api/buses/:id` - Update bus
- `DELETE /api/buses/:id` - Delete bus

**Issues Found:**
- Query joins `drivers.name` and `routes.name` but schema doesn't have these fields
- Should join with `users` table for driver name

#### GPS Tracking (`/api/gps`)
- `GET /api/gps/latest` - Get latest GPS positions for all active buses
- `GET /api/gps/bus/:busId/history` - Get GPS history for specific bus
- `POST /api/gps/update` - Update GPS location (from device/simulator)
  - Emits real-time update via Socket.IO

#### Routes (`/api/routes`)
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get single route
- `POST /api/routes` - Create new route

**Issues Found:**
- POST route uses `distance` and `estimated_duration` but schema expects `distance_km` and `estimated_duration_minutes`

#### Schedules (`/api/schedules`)
- `GET /api/schedules` - Get all schedules with bus and route info

#### Incidents (`/api/incidents`)
- `GET /api/incidents` - Get all incidents with bus and driver info
- `POST /api/incidents` - Report new incident

**Issues Found:**
- POST route uses `type` but schema expects `incident_type`
- POST route includes `latitude` and `longitude` but schema doesn't have these fields
- POST route sets status to 'open' but schema enum doesn't include 'open'

#### Messages (`/api/messages`)
- `GET /api/messages` - Get all messages with sender/receiver names
- `POST /api/messages` - Send new message

**Issues Found:**
- Query joins `users.name` but schema uses `first_name` and `last_name`

### 4.3 Socket.IO Server

**File**: `backend/socket/socket-server.ts`

**Events:**
- **Client → Server:**
  - `subscribe-gps` - Subscribe to all GPS updates
  - `track-bus` - Track specific bus by ID
  - `untrack-bus` - Stop tracking specific bus

- **Server → Client:**
  - `gps-update` - Broadcast GPS updates (every 5 seconds)
  - `bus-location` - Send specific bus location update

**Implementation:**
- Broadcasts GPS data every 5 seconds to subscribed clients
- Uses Socket.IO rooms for efficient message routing
- Queries latest GPS positions from database

---

## 5. Frontend Analysis

### 5.1 Next.js Configuration

**File**: `frontend/next.config.mjs`
- TypeScript build errors ignored (⚠️ not recommended for production)
- Images unoptimized
- Mapbox GL transpilation enabled
- Turbopack enabled

### 5.2 Authentication System

**File**: `frontend/lib/auth-context.tsx`
- React Context for global auth state
- LocalStorage persistence
- Login with email/password
- Google OAuth support (optional)
- Automatic redirect based on user role

**File**: `frontend/lib/auth.ts`
- JWT token signing/verification
- Token extraction from requests
- User extraction from JWT

**File**: `frontend/app/api/auth/login/route.ts`
- Next.js API route that proxies to database
- Uses frontend database connection (⚠️ security concern)
- Returns JWT token and user data

### 5.3 API Architecture

**File**: `frontend/lib/api.ts`
- Base URL: `http://localhost:4000` (configurable)
- `apiRequest()` - Basic fetch wrapper
- `authenticatedRequest()` - Adds JWT token from localStorage

**File**: `frontend/lib/api-proxy.ts`
- Proxy utility for API calls

**File**: `frontend/app/api/proxy/route.ts`
- Next.js API route that proxies requests to backend
- Useful for avoiding CORS issues

### 5.4 Real-time Communication

**File**: `frontend/hooks/use-socket.ts`
- ⚠️ **CRITICAL ISSUE**: Uses STOMP/SockJS but backend uses Socket.IO
- This is a **mismatch** - the hook won't work with current backend
- Should use `socket.io-client` instead

**Correct Implementation Should Be:**
```typescript
import { io } from 'socket.io-client'
```

### 5.5 Map Components

**File**: `frontend/components/mapbox-map.tsx`
- Full Mapbox GL JS implementation
- Hardcoded Mapbox token (⚠️ security issue)
- Displays buses, stations, routes
- Interactive markers and popups
- Real-time updates support

**File**: `frontend/components/bus-map.tsx`
- Wrapper component for MapboxMap
- Props: height, showControls, driverMode, highlightBus, centerOn

**File**: `frontend/components/live-map.tsx`
- Live tracking map with bus markers
- Real-time GPS updates

### 5.6 User Portals

#### Admin Dashboard (`/dashboard`)
- Fleet overview
- Live map
- Statistics grid
- Recent activity
- Quick actions
- Recent tickets

#### Driver Portal (`/driver-portal`)
- Route navigation
- Live map with fullscreen support
- Route progress indicator
- Quick actions (report issue, call dispatch, complete trip)
- Active alerts
- Performance stats

#### Client Portal (`/client-portal`)
- Live bus tracking
- Available buses list
- Upcoming trips
- Ticket booking

### 5.7 Middleware

**File**: `frontend/middleware.ts`
- Security headers (X-Frame-Options, CSP, HSTS, etc.)
- Applied to all routes except static files
- Production-ready security configuration

---

## 6. Security Analysis

### 6.1 Authentication
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ⚠️ Default JWT secret in code (should use environment variable)
- ⚠️ Frontend API routes access database directly (should use backend API)

### 6.2 Database Security
- ⚠️ Default credentials (root/root) - should be changed in production
- ✅ SQL injection protection via parameterized queries
- ✅ Connection pooling limits

### 6.3 API Security
- ✅ CORS enabled (but allows all origins in development)
- ✅ Security headers in middleware
- ⚠️ No rate limiting
- ⚠️ No request validation middleware
- ⚠️ No authentication middleware on protected routes

### 6.4 Frontend Security
- ✅ Security headers via Next.js middleware
- ⚠️ Mapbox token hardcoded in component
- ⚠️ JWT token stored in localStorage (XSS vulnerability)
- ✅ Content Security Policy configured

---

## 7. Issues and Recommendations

### 7.1 Critical Issues

1. **Socket.IO Mismatch**
   - Frontend uses STOMP/SockJS but backend uses Socket.IO
   - **Fix**: Update `use-socket.ts` to use `socket.io-client`

2. **Database Schema Mismatches**
   - Auth routes reference `name` field that doesn't exist
   - Bus routes join non-existent `drivers.name` field
   - Incident routes use wrong field names
   - **Fix**: Update queries to match actual schema

3. **Frontend Database Access**
   - Frontend API routes access database directly
   - **Fix**: All database operations should go through backend API

4. **Hardcoded Secrets**
   - Mapbox token in component
   - JWT secret with default value
   - **Fix**: Move to environment variables

### 7.2 High Priority Issues

1. **Missing Authentication Middleware**
   - Protected routes don't verify JWT tokens
   - **Fix**: Add authentication middleware to backend routes

2. **No Input Validation**
   - API routes don't validate request bodies
   - **Fix**: Add Zod/joi validation middleware

3. **No Error Handling**
   - Many routes lack proper error handling
   - **Fix**: Add error handling middleware

4. **TypeScript Build Errors Ignored**
   - `ignoreBuildErrors: true` in next.config.mjs
   - **Fix**: Fix TypeScript errors and remove this setting

### 7.3 Medium Priority Issues

1. **No Rate Limiting**
   - API endpoints vulnerable to abuse
   - **Fix**: Add rate limiting middleware

2. **JWT in localStorage**
   - Vulnerable to XSS attacks
   - **Fix**: Consider httpOnly cookies (with CSRF protection)

3. **No Request Logging**
   - Difficult to debug production issues
   - **Fix**: Add request logging middleware

4. **Database Connection in Frontend**
   - Frontend has database connection pool
   - **Fix**: Remove and use backend API only

### 7.4 Low Priority / Improvements

1. **Code Organization**
   - Some duplicate code between frontend API routes and backend
   - **Fix**: Consolidate API logic in backend

2. **Type Safety**
   - Some `any` types used
   - **Fix**: Add proper TypeScript types

3. **Testing**
   - No test files found
   - **Fix**: Add unit and integration tests

4. **Documentation**
   - API endpoints not documented
   - **Fix**: Add OpenAPI/Swagger documentation

---

## 8. Environment Variables

### Required Variables

**Backend (.env):**
```env
DB_HOST=localhost
DB_PORT=8889
DB_USER=root
DB_PASSWORD=root
DB_NAME=bus_tracking_system
BACKEND_PORT=4000
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id (optional)
DATABASE_HOST=localhost
DATABASE_PORT=8889
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=bus_tracking_system
JWT_SECRET=your-secret-key-change-in-production
```

---

## 9. Development Workflow

### 9.1 Setup Process

1. **Install Dependencies:**
   ```bash
   pnpm install
   cd backend && npm install
   ```

2. **Start MAMP:**
   - Ensure MySQL is running on port 8889

3. **Setup Database:**
   ```bash
   pnpm setup:db
   ```

4. **Configure Environment:**
   - Copy `.env.example` files
   - Add Mapbox token

5. **Start Development:**
   ```bash
   pnpm dev  # Runs both frontend and backend
   ```

### 9.2 Available Scripts

**Root:**
- `pnpm dev` - Start frontend + backend concurrently
- `pnpm setup:db` - Setup database
- `pnpm check:mamp` - Check MAMP connection

**Backend:**
- `npm run dev` - Start backend with tsx watch
- `npm run build` - Build TypeScript
- `npm start` - Start production server

**Frontend:**
- `pnpm dev` - Start Next.js dev server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

---

## 10. Deployment Considerations

### 10.1 Production Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Configure production database
- [ ] Set up environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] Fix TypeScript errors
- [ ] Remove hardcoded tokens
- [ ] Add authentication middleware
- [ ] Fix Socket.IO client implementation
- [ ] Add input validation
- [ ] Set up database backups

### 10.2 Infrastructure

**Recommended Stack:**
- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render / AWS EC2
- **Database**: AWS RDS / PlanetScale / Railway MySQL
- **Socket.IO**: Same server as backend (or Redis adapter for scaling)

---

## 11. Code Quality Metrics

### 11.1 Strengths
- ✅ Modern tech stack (Next.js 16, React 19, TypeScript)
- ✅ Good project structure
- ✅ Comprehensive database schema
- ✅ Real-time capabilities
- ✅ Multi-role user system
- ✅ Security headers configured
- ✅ Responsive design considerations

### 11.2 Weaknesses
- ⚠️ TypeScript errors ignored
- ⚠️ No tests
- ⚠️ Inconsistent error handling
- ⚠️ Some security vulnerabilities
- ⚠️ Schema/API mismatches
- ⚠️ Socket.IO client mismatch

---

## 12. Feature Completeness

### 12.1 Implemented Features
- ✅ User authentication (login/register)
- ✅ Multi-role system (admin/driver/client)
- ✅ Bus fleet management
- ✅ Route management
- ✅ GPS tracking (backend)
- ✅ Real-time updates (Socket.IO server)
- ✅ Ticket booking UI
- ✅ Dashboard for each role
- ✅ Map integration (Mapbox)
- ✅ Incident reporting
- ✅ Messaging system
- ✅ Payment tracking
- ✅ Camera management
- ✅ Performance metrics

### 12.2 Partially Implemented
- ⚠️ Real-time GPS updates (backend ready, frontend client mismatch)
- ⚠️ Ticket booking (UI exists, backend integration unclear)
- ⚠️ Payment processing (structure exists, no payment gateway)

### 12.3 Missing Features
- ❌ Email notifications
- ❌ SMS alerts
- ❌ Push notifications
- ❌ QR code generation for tickets
- ❌ Payment gateway integration
- ❌ Admin user management UI
- ❌ Driver assignment workflow
- ❌ Schedule management UI
- ❌ Analytics dashboard (structure exists, data unclear)

---

## 13. Conclusion

This is a **well-structured** bus tracking system with a solid foundation, but it has several **critical issues** that need to be addressed before production use:

1. **Socket.IO client mismatch** - Frontend won't receive real-time updates
2. **Database schema mismatches** - Several API routes will fail
3. **Security concerns** - Hardcoded secrets, frontend DB access, no auth middleware
4. **TypeScript errors ignored** - May hide runtime issues

**Recommendation**: Fix critical issues first, then address security concerns, then add missing features and tests.

**Estimated Effort to Production-Ready:**
- Critical fixes: 2-3 days
- Security improvements: 2-3 days
- Testing: 3-5 days
- Missing features: 1-2 weeks

**Total: ~3-4 weeks** of focused development work.

---

## Appendix: File Count Summary

- **Backend Routes**: 7 files
- **Frontend Pages**: ~20+ pages
- **Frontend Components**: ~50+ components
- **Database Tables**: 13 tables
- **API Endpoints**: ~30+ endpoints
- **Total TypeScript Files**: ~100+ files

---

*Analysis completed on: 2025-01-XX*
*Analyzed by: AI Assistant*

