# Bus Tracking System - Backend API

Complete Express.js REST API with Socket.IO for real-time GPS tracking.

## Features

- ✅ RESTful API endpoints for all resources
- ✅ Real-time GPS tracking via Socket.IO
- ✅ MySQL database integration
- ✅ JWT authentication
- ✅ TypeScript support
- ✅ CORS enabled

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run development server:
```bash
npm run dev
```

Server will run on `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get bus by ID
- `POST /api/buses` - Create new bus
- `PUT /api/buses/:id` - Update bus
- `DELETE /api/buses/:id` - Delete bus

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route by ID
- `POST /api/routes` - Create new route

### Schedules
- `GET /api/schedules` - Get all schedules

### Incidents
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents` - Report new incident

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send new message

### GPS Tracking
- `GET /api/gps/latest` - Get latest GPS positions for all buses
- `GET /api/gps/bus/:busId/history` - Get GPS history for specific bus
- `POST /api/gps/update` - Update GPS position (from device/simulator)

## Socket.IO Events

### Client to Server
- `subscribe-gps` - Subscribe to real-time GPS updates
- `track-bus` - Track specific bus by ID
- `untrack-bus` - Stop tracking specific bus

### Server to Client
- `gps-update` - Broadcast GPS updates (every 5 seconds)
- `bus-location` - Send specific bus location update

## Production Build

```bash
npm run build
npm start
```
