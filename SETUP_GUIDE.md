# GearGuard - Complete Setup Guide

This guide will walk you through setting up the GearGuard Maintenance Tracker on your local machine.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (Community Edition)
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from https://www.mongodb.com/try/download/community
   - **Linux (Ubuntu/Debian)**:
     ```bash
     wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
     echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
     sudo apt-get update
     sudo apt-get install -y mongodb-org
     ```

## Step-by-Step Setup

### Step 1: Start MongoDB

MongoDB must be running before starting the application.

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Start on boot
```

**Windows:**
1. Open Services (Win + R, type `services.msc`)
2. Find "MongoDB Server"
3. Right-click and select "Start"

**Verify MongoDB is running:**
```bash
# Connect to MongoDB shell
mongosh

# Or check if port 27017 is listening
netstat -an | grep 27017
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express (Web framework)
- mongoose (MongoDB ODM)
- cors (Cross-Origin Resource Sharing)
- dotenv (Environment variables)

### Step 3: Configure Backend Environment

The backend/.env file is already configured with default settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gearguard
```

If you need to change the MongoDB connection:
- Change the database name: `mongodb://localhost:27017/your_db_name`
- Use authentication: `mongodb://username:password@localhost:27017/gearguard`
- Use different port: `mongodb://localhost:27018/gearguard`

### Step 4: Start the Backend Server

```bash
# From the backend directory
npm start

# You should see:
# Server running on port 5000
# MongoDB Connected: localhost
```

The backend API will be available at: `http://localhost:5000`

### Step 5: Install Frontend Dependencies

Open a new terminal window and navigate to the project root:

```bash
cd /path/to/project
npm install
```

This will install:
- react & react-dom
- vite (Build tool)
- tailwindcss (CSS framework)
- lucide-react (Icons)

### Step 6: Start the Frontend Development Server

```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## Testing the Application

### 1. Create a Maintenance Team

1. Open the application: `http://localhost:5173`
2. Click on "Teams" in the sidebar
3. Click "Add Team"
4. Fill in the details:
   - Team Name: "Mechanical Team"
   - Specialization: "Mechanical Repairs"
   - Description: "Handles all mechanical equipment"
5. Add team members:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "555-0123"
6. Click "Create Team"

### 2. Add Equipment

1. Click on "Equipment" in the sidebar
2. Click "Add Equipment"
3. Fill in the details:
   - Equipment Name: "CNC Machine 01"
   - Serial Number: "CNC-2024-001"
   - Category: "Machine"
   - Department: "Production"
   - Assigned To: "John Smith"
   - Maintenance Team: Select the team you created
   - Location: "Factory Floor - Section A"
   - Purchase Date: Select a date
4. Click "Add Equipment"

### 3. Create a Maintenance Request

1. Click on "Kanban Board" in the sidebar
2. Click "New Request"
3. Fill in the details:
   - Subject: "Oil Leak Repair"
   - Description: "Machine is leaking oil from the main cylinder"
   - Equipment: Select "CNC Machine 01"
   - Request Type: "Corrective"
   - Priority: "High"
   - Scheduled Date: Select today's date
   - Assigned Technician Name: "John Doe"
4. Notice how the Category and Team are auto-filled!
5. Click "Create Request"

### 4. Test Drag and Drop

1. You should see your request in the "New" column
2. Try dragging the request card to "In Progress"
3. Drag it to "Repaired" when done
4. The status updates automatically!

### 5. Test Calendar View

1. Click on "Calendar" in the sidebar
2. Click on any date
3. Create a "Preventive" maintenance request
4. The request will appear on the calendar

### 6. Test Smart Buttons

1. Go back to "Equipment"
2. Click "Maintenance Requests" button on any equipment card
3. View all maintenance requests for that specific equipment
4. The badge shows the count of open requests

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:
- Ensure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
- Check if port 27017 is available: `lsof -i :27017`
- Try restarting MongoDB

### Backend Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
- Change the port in `backend/.env`: `PORT=5001`
- Kill the process using port 5000: `lsof -ti:5000 | xargs kill`

### Frontend Build Errors

**Error**: Module not found errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

If you see CORS errors in the browser console:

**Solution**:
- Ensure backend is running on `http://localhost:5000`
- Check that frontend proxy is configured in `vite.config.js`
- Verify CORS is enabled in `backend/server.js`

## Production Build

### Build Frontend

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Deploy

1. **Backend**: Deploy to services like Heroku, Railway, or DigitalOcean
   - Set environment variables for MongoDB Atlas connection
   - Use a production-grade MongoDB instance

2. **Frontend**: Deploy to Vercel, Netlify, or any static hosting
   - Update API URLs to point to production backend
   - Build and deploy the `dist/` folder

## Database Management

### View Database Contents

```bash
mongosh

use gearguard

# View collections
show collections

# View teams
db.teams.find().pretty()

# View equipment
db.equipments.find().pretty()

# View maintenance requests
db.maintenancerequests.find().pretty()
```

### Clear All Data

```bash
mongosh

use gearguard
db.dropDatabase()
```

### Backup Database

```bash
mongodump --db=gearguard --out=/path/to/backup
```

### Restore Database

```bash
mongorestore --db=gearguard /path/to/backup/gearguard
```

## API Testing with curl

### Create a Team

```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IT Support",
    "specialization": "Computer Repairs",
    "description": "Handles all IT equipment",
    "members": [
      {
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "555-0124"
      }
    ]
  }'
```

### Get All Equipment

```bash
curl http://localhost:5000/api/equipment
```

### Get All Requests

```bash
curl http://localhost:5000/api/requests
```

## Tips for Best Experience

1. **Start with Teams**: Always create teams before adding equipment
2. **Use Categories**: Properly categorize equipment for better organization
3. **Set Realistic Dates**: Use appropriate scheduled dates for better tracking
4. **Drag and Drop**: Take advantage of the Kanban board for visual workflow
5. **Calendar View**: Use calendar view for planning preventive maintenance
6. **Smart Buttons**: Use equipment smart buttons to quickly view related requests

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify MongoDB is running
3. Check browser console for errors
4. Verify backend API is responding at `http://localhost:5000`

## Next Steps

Now that your system is set up:

1. Create your company's maintenance teams
2. Add all equipment/assets to the system
3. Start creating maintenance requests
4. Use the Kanban board to manage workflows
5. Schedule preventive maintenance using the calendar
6. Track equipment maintenance history using smart buttons

Enjoy using GearGuard!
