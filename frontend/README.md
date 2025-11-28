# Bus Tracking System - Frontend

Next.js 16 frontend application for the bus tracking system.

## Development

```bash
npm install
npm run dev
```

The app will run on `http://localhost:3000`

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
```

## Features

- 🎨 Modern UI with shadcn/ui components
- 🗺️ Real-time GPS tracking with Mapbox
- 📱 Fully responsive design
- 🌓 Dark/Light mode
- 👥 Multi-role portals (Admin, Driver, Client)
- 📊 Analytics dashboards
- 💬 Real-time messaging with Socket.IO

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Mapbox GL
- Socket.IO Client
- shadcn/ui
