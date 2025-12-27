# GearGuard - Ultimate Maintenance Tracker

A comprehensive maintenance management system for tracking company assets and managing maintenance requests.

## Features

- **Equipment Management**: Track all company assets with detailed information
- **Team Management**: Manage maintenance teams and their members
- **Kanban Board**: Visual workflow management with drag-and-drop functionality
- **Calendar View**: Schedule and track preventive maintenance
- **Smart Automation**: Auto-fill equipment details, smart buttons with request counts
- **Beautiful UI**: Modern design with soft elevation effects

## Tech Stack

### Frontend
- React.js (JavaScript)
- Tailwind CSS
- Lucide React Icons
- Vite

### Backend
- Node.js
- Express.js
- MongoDB

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running locally

### 1. MongoDB Setup

Make sure MongoDB is installed and running on your system:

```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Start MongoDB (Linux)
sudo systemctl start mongod

# Start MongoDB (Windows)
# Use MongoDB Compass or start the service from Services
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm start

# The backend will run on http://localhost:5000
```

### 3. Frontend Setup

```bash
# From the project root directory
npm install

# Start the development server
npm run dev

# The frontend will run on http://localhost:5173
```

### 4. Build for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## Usage Guide

### Creating Teams
1. Navigate to the "Teams" section
2. Click "Add Team"
3. Enter team details and add team members
4. Save the team

### Adding Equipment
1. Go to "Equipment" section
2. Click "Add Equipment"
3. Fill in equipment details
4. Assign a maintenance team
5. Save the equipment

### Creating Maintenance Requests

#### Corrective Maintenance (Breakdown)
1. Go to "Kanban Board"
2. Click "New Request"
3. Select equipment (team will auto-fill)
4. Set request type to "Corrective"
5. Add description and priority
6. Submit the request

#### Preventive Maintenance (Scheduled)
1. Go to "Calendar" view
2. Click on a date
3. Create a new request
4. Set request type to "Preventive"
5. Schedule the maintenance date

### Managing Requests
- Drag and drop cards between stages: New → In Progress → Repaired → Scrap
- View all maintenance requests for specific equipment using the smart button
- Track overdue requests with visual indicators

## API Endpoints

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create a new team
- `PUT /api/teams/:id` - Update a team
- `DELETE /api/teams/:id` - Delete a team

### Equipment
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `GET /api/equipment/:id/requests` - Get all requests for equipment
- `GET /api/equipment/:id/requests/count` - Get open request count

### Maintenance Requests
- `GET /api/requests` - Get all requests
- `GET /api/requests/calendar` - Get preventive maintenance requests
- `POST /api/requests` - Create a new request
- `PUT /api/requests/:id` - Update a request
- `DELETE /api/requests/:id` - Delete a request

## Database Models

### Team
- name
- specialization
- description
- members (array of objects with name, email, phone)

### Equipment
- name
- serialNumber
- category
- department
- assignedTo
- maintenanceTeam (reference)
- defaultTechnician
- purchaseDate
- warrantyExpiry
- location
- status

### MaintenanceRequest
- subject
- description
- equipment (reference)
- equipmentCategory
- maintenanceTeam (reference)
- assignedTo
- requestType (Corrective/Preventive)
- stage (New/In Progress/Repaired/Scrap)
- priority
- scheduledDate
- completedDate
- duration
- createdBy

## License

MIT
