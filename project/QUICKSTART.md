# GearGuard - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js installed
- MongoDB installed and running

## Quick Setup

### 1. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows - Start MongoDB service from Services panel
```

### 2. Start Backend (Terminal 1)

```bash
cd backend
npm install
npm start
```

Wait for: `MongoDB Connected: localhost`

### 3. Start Frontend (Terminal 2)

```bash
npm install
npm run dev
```

Open browser to: `http://localhost:5173`

## Quick Test

### Create a Team
1. Click "Teams" → "Add Team"
2. Name: "Mechanical Team"
3. Specialization: "Mechanical Repairs"
4. Add a member with name and email
5. Click "Create Team"

### Add Equipment
1. Click "Equipment" → "Add Equipment"
2. Fill in:
   - Name: "CNC Machine 01"
   - Serial: "CNC-001"
   - Category: "Machine"
   - Department: "Production"
   - Select the team you created
   - Add location
3. Click "Add Equipment"

### Create Request
1. Click "Kanban Board" → "New Request"
2. Fill in:
   - Subject: "Oil Leak"
   - Select the equipment
   - Type: "Corrective"
   - Priority: "High"
3. Watch it auto-fill team info!
4. Click "Create Request"

### Test Drag & Drop
- Drag your request from "New" to "In Progress"
- Then to "Repaired"

That's it! You're ready to use GearGuard.

## Common URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017/gearguard

## Need Help?

See `SETUP_GUIDE.md` for detailed instructions.
See `FEATURES.md` for complete feature list.
See `README.md` for full documentation.

## Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB is running: `mongosh`

**Port already in use?**
- Change backend port in `backend/.env`

**Can't drag requests?**
- Make sure you click and hold on the card
