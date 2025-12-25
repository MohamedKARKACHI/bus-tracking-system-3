#!/bin/bash

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Bus Tracking System - All Services${NC}"
echo ""

# Kill any existing processes on relevant ports
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
pkill -f "next dev" || true
pkill -f "uvicorn" || true
sleep 1

# Check if backends are already running
echo -e "${YELLOW}📡 Checking backend services...${NC}"

# Start ANPR Service on port 8001
echo -e "${YELLOW}▶️  Starting ANPR Service on port 8001...${NC}"
cd "$(dirname "$0")/anpr-service"
chmod +x run.sh
./run.sh &
ANPR_PID=$!
sleep 3

# Check ANPR health
echo -e "${YELLOW}🏥 Checking ANPR health...${NC}"
if curl -s http://localhost:8001/health > /dev/null; then
    echo -e "${GREEN}✅ ANPR Service is running on port 8001${NC}"
else
    echo -e "${RED}⚠️  ANPR Service not responding yet...${NC}"
fi

echo ""

# Start Backend (Spring Boot)
echo -e "${YELLOW}▶️  Starting Backend (Spring Boot) on port 4000...${NC}"
# Use absolute path or cd ..
cd ..
./mvnw -f backend/pom.xml spring-boot:run &
BACKEND_PID=$!
sleep 20 # Wait for Spring Boot to initialize

# Check Backend health
echo -e "${GREEN}⏳ Backend (Spring Boot) started with PID $BACKEND_PID${NC}"
echo ""

# Start Frontend on port 3000
echo -e "${YELLOW}▶️  Starting Frontend on port 3000...${NC}"
cd "$(dirname "$0")/frontend"
npm run dev &
FRONTEND_PID=$!
sleep 4

# Check Frontend health
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running on port 3000${NC}"
else
    echo -e "${RED}⚠️  Frontend not responding yet...${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 System Started Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${GREEN}📌 Service URLs:${NC}"
echo -e "   Frontend:   ${GREEN}http://localhost:3000${NC}"
echo -e "   ANPR API:   ${GREEN}http://localhost:8001${NC}"
echo -e "   Health:     ${GREEN}curl http://localhost:8001/health${NC}"
echo ""
echo -e "${YELLOW}📖 Next Steps:${NC}"
echo -e "   1. Open http://localhost:3000 in your browser"
echo -e "   2. Navigate to 'Check-in/Out' page"
echo -e "   3. Click '${GREEN}Start Service${NC}' button"
echo -e "   4. Allow camera permissions"
echo -e "   5. Click 'Capture Entry' or 'Capture Exit' to test"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for all background processes
wait
