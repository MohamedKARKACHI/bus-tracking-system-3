# 🚀 Quick Start Guide

Get the Bus Tracking System running in 5 minutes!

## Prerequisites Check ✓

Before starting, ensure you have:
- [x] Node.js 18+ installed
- [x] MAMP installed and running
- [x] Terminal/Command line access

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

```bash
cd bus-tracking-system-3

# Install all dependencies for both frontend and backend
npm run install:all
```

**Expected output:**
```
✓ Frontend: 221 packages installed
✓ Backend: 141 packages installed
✓ 0 vulnerabilities
```

### 2. Setup Database (2 minutes)

#### Start MAMP
1. Open MAMP application
2. Click "Start Servers"
3. Wait for green lights ✅

#### Import Database
1. Open phpMyAdmin: http://localhost:8888/phpMyAdmin/
2. Click "New" → Create database: `bus_tracking_system`
3. Click database name → Import tab
4. Choose file: `database/schema.sql` → Click "Go"
5. Import tab again → Choose file: `database/seed.sql` → Click "Go"

**Verification:**
```bash
# Should show "1" if database is accessible
mysql -h localhost -P 8889 -u root -proot -e "SELECT 1;"
```

### 3. Configure Environment (30 seconds)

#### Frontend
File already created at `frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Backend  
File already configured at `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=8889
DB_USER=root
DB_PASSWORD=root
DB_NAME=bus_tracking_system
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key
```

✅ No changes needed for local development!

### 4. Start the Application (30 seconds)

```bash
# From project root
npm run dev
```

**Expected output:**
```
[1] ✅ Database connected successfully
[1] Socket.IO server initialized
[1] 🚀 Backend server running on http://localhost:4000
[1] 📡 Socket.IO enabled for real-time tracking

[0] ▲ Next.js 16.0.3 (Turbopack)
[0] - Local:    http://localhost:3000
[0] ✓ Ready in 477ms
```

### 5. Access the Application 🎉

Open your browser and visit:

**Main Application:**
- http://localhost:3000

**Test Pages:**
- Admin Dashboard: http://localhost:3000/dashboard
- Driver Portal: http://localhost:3000/driver-portal
- Client Portal: http://localhost:3000/client-portal
- Live Tracking: http://localhost:3000/tracking

**Backend API:**
- Health Check: http://localhost:4000/health
- API Base: http://localhost:4000/api

## Verification Steps

### ✓ Backend is Running
```bash
curl http://localhost:4000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### ✓ Database is Connected
Check terminal output for:
```
✅ Database connected successfully
```

### ✓ Frontend is Running
Open http://localhost:3000 in browser - should see the landing page

### ✓ Socket.IO is Working
Check browser console (F12) - should see:
```
Socket.IO connection established
```

## Default Credentials (Sample Data)

The seed file includes test users:

```
Admin:
  Email: admin@bustrak.com
  Password: admin123

Driver 1:
  Email: driver1@bustrak.com  
  Password: driver123

Driver 2:
  Email: driver2@bustrak.com
  Password: driver123

Client 1:
  Email: client1@example.com
  Password: client123

Client 2:
  Email: client2@example.com
  Password: client123
```

## Common Issues & Quick Fixes

### ❌ "Cannot connect to database"
**Fix:**
```bash
# Check if MAMP MySQL is running on port 8889
lsof -i :8889

# Restart MAMP if needed
# Open MAMP → Stop → Start
```

### ❌ "Port 3000 already in use"
**Fix:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Then restart
npm run dev
```

### ❌ "Port 4000 already in use"
**Fix:**
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Then restart
npm run dev
```

### ❌ "Module not found" errors
**Fix:**
```bash
# Reinstall all dependencies
npm run install:all

# Clear Next.js cache
cd frontend && rm -rf .next && cd ..

# Restart
npm run dev
```

### ❌ Frontend can't reach backend API
**Fix:**
```bash
# 1. Check backend is running
curl http://localhost:4000/health

# 2. Verify environment variable
cat frontend/.env.local
# Should show: NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

# 3. Restart both servers
npm run dev
```

## Development Workflow

### Daily Start
```bash
# 1. Start MAMP (if not auto-start)
# 2. Navigate to project
cd bus-tracking-system-3

# 3. Start development servers
npm run dev

# Both servers auto-reload on file changes ✨
```

### Making Changes

**Frontend changes:**
- Edit files in `frontend/app/` or `frontend/components/`
- Browser auto-refreshes

**Backend changes:**
- Edit files in `backend/routes/` or `backend/server.ts`
- Server auto-restarts (tsx watch)

**Database changes:**
- Update `database/schema.sql`
- Re-import in phpMyAdmin

### Stopping Servers
```bash
# Press Ctrl+C in terminal
# Stops both frontend and backend
```

## Next Steps

### 1. Explore the Application
- Try logging in with test credentials
- Navigate different portals (Admin, Driver, Client)
- Test real-time GPS tracking on the map
- Book a test ticket

### 2. Customize
- Update colors in `frontend/app/globals.css`
- Add your Mapbox token in `frontend/.env.local`
- Modify components in `frontend/components/`

### 3. Add Features
- Create new pages in `frontend/app/`
- Add API endpoints in `backend/routes/`
- Extend database schema

### 4. Deploy (Optional)
See `README.md` for production deployment guide

## Useful Commands

```bash
# Start both servers
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Install dependencies
npm run install:all

# Build for production
cd frontend && npm run build
cd backend && npm run build
```

## Project Structure Reminder

```
bus-tracking-system-3/
├── frontend/        → Next.js app (edit UI here)
├── backend/         → Express API (edit API here)
├── database/        → SQL files
├── package.json     → Root orchestration
└── README.md        → Full documentation
```

## Support Resources

- **Main README:** `README.md` - Complete documentation
- **Architecture:** `ARCHITECTURE.md` - System design
- **API Docs:** `backend/README.md` - API endpoints
- **Frontend Guide:** `frontend/README.md` - Frontend details

## Success Checklist ✅

Before you start coding, verify:

- [ ] MAMP servers running (green lights)
- [ ] Database `bus_tracking_system` exists
- [ ] Tables imported (13 tables)
- [ ] Sample data loaded
- [ ] `npm run dev` shows both servers running
- [ ] http://localhost:3000 loads
- [ ] http://localhost:4000/health returns OK
- [ ] No errors in terminal
- [ ] Browser console shows no errors

**All checked?** You're ready to develop! 🚀

---

**Need Help?**
- Check `TROUBLESHOOTING.md` (if exists)
- Review error messages in terminal
- Check browser console (F12)
- Verify MAMP is running
- Ensure correct ports (3000, 4000, 8889)

**Happy Coding!** 💻
