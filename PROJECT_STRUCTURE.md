# GearGuard - Project Structure

## Directory Overview

```
gearguard/
├── backend/                    # Node.js + Express backend
│   ├── config/                # Configuration files
│   │   └── db.js             # MongoDB connection setup
│   ├── models/               # Mongoose data models
│   │   ├── Team.js          # Team schema and model
│   │   ├── Equipment.js     # Equipment schema and model
│   │   └── MaintenanceRequest.js  # Request schema and model
│   ├── routes/              # Express route handlers
│   │   ├── teamRoutes.js    # Team CRUD endpoints
│   │   ├── equipmentRoutes.js  # Equipment CRUD endpoints
│   │   └── requestRoutes.js    # Request CRUD endpoints
│   ├── .env                 # Environment variables
│   ├── server.js            # Express server entry point
│   └── package.json         # Backend dependencies
│
├── src/                     # React frontend source
│   ├── components/          # React components
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── KanbanBoard.jsx  # Main kanban view
│   │   ├── RequestCard.jsx  # Individual request card
│   │   ├── RequestModal.jsx # Create/edit request modal
│   │   ├── CalendarView.jsx # Calendar for preventive maintenance
│   │   ├── EquipmentManager.jsx  # Equipment management
│   │   └── TeamManager.jsx       # Team management
│   ├── utils/              # Utility functions
│   │   └── api.js          # API client for backend
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles + Tailwind
│
├── public/                  # Static assets
├── dist/                    # Production build output
├── node_modules/            # Frontend dependencies
│
├── index.html               # HTML entry point
├── package.json             # Frontend dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
│
└── Documentation/
    ├── README.md           # Main documentation
    ├── QUICKSTART.md       # Quick start guide
    ├── SETUP_GUIDE.md      # Detailed setup instructions
    ├── FEATURES.md         # Complete feature list
    └── PROJECT_STRUCTURE.md # This file
```

## Backend Structure

### Models (`backend/models/`)

**Team.js**
- Schema for maintenance teams
- Fields: name, members, specialization, description
- Used for organizing technicians

**Equipment.js**
- Schema for company assets
- Fields: name, serialNumber, category, department, location, etc.
- References Team model for maintenance team assignment

**MaintenanceRequest.js**
- Schema for maintenance work orders
- Fields: subject, description, equipment, requestType, stage, priority, etc.
- References both Equipment and Team models

### Routes (`backend/routes/`)

**teamRoutes.js**
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get specific team
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

**equipmentRoutes.js**
- `GET /api/equipment` - List all equipment
- `GET /api/equipment/:id` - Get specific equipment
- `GET /api/equipment/:id/requests` - Get equipment's requests
- `GET /api/equipment/:id/requests/count` - Get open request count
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

**requestRoutes.js**
- `GET /api/requests` - List all requests
- `GET /api/requests/calendar` - Get preventive requests
- `GET /api/requests/:id` - Get specific request
- `POST /api/requests` - Create new request (with auto-fill)
- `PUT /api/requests/:id` - Update request (with scrap logic)
- `DELETE /api/requests/:id` - Delete request

### Configuration (`backend/config/`)

**db.js**
- MongoDB connection using Mongoose
- Connection error handling
- Database initialization

**server.js**
- Express app configuration
- Middleware setup (CORS, JSON parsing)
- Route mounting
- Server startup

## Frontend Structure

### Components (`src/components/`)

**Sidebar.jsx**
- Navigation menu
- Active view highlighting
- Icons for each section

**KanbanBoard.jsx**
- Main workflow management view
- Four-column layout (New, In Progress, Repaired, Scrap)
- Drag and drop functionality
- Request creation modal trigger

**RequestCard.jsx**
- Individual request display
- Priority badges
- Overdue indicators
- Technician avatars
- Draggable functionality

**RequestModal.jsx**
- Create and edit requests
- Form validation
- Auto-fill logic display
- Equipment selection

**CalendarView.jsx**
- Monthly calendar display
- Preventive maintenance scheduling
- Date navigation
- Request visualization

**EquipmentManager.jsx**
- Equipment CRUD operations
- Smart buttons with request counts
- Equipment cards with details
- Status indicators

**TeamManager.jsx**
- Team CRUD operations
- Member management
- Team cards display
- Avatar generation

### Utilities (`src/utils/`)

**api.js**
- Centralized API client
- Fetch wrapper with error handling
- Organized by resource (teams, equipment, requests)
- Used by all components for backend communication

### Main Application (`src/`)

**App.jsx**
- Main application shell
- View routing logic
- Data loading and state management
- Header and layout

**main.jsx**
- React initialization
- Root component mounting

**index.css**
- Tailwind CSS imports
- Custom utility classes
- Soft elevation effects
- Animation keyframes
- Custom scrollbar styles

## Configuration Files

### Frontend Configuration

**vite.config.js**
- Vite build tool configuration
- React plugin setup
- Proxy configuration for API calls

**tailwind.config.js**
- Tailwind CSS configuration
- Content paths
- Theme customization

**postcss.config.js**
- PostCSS configuration
- Tailwind and Autoprefixer plugins

**package.json**
- Project metadata
- Dependencies list
- npm scripts (dev, build, preview)

### Backend Configuration

**backend/.env**
- Environment variables
- PORT: Server port number
- MONGODB_URI: Database connection string

**backend/package.json**
- Backend dependencies
- npm scripts (start, dev)

## Data Flow

### Request Creation Flow

1. User clicks "New Request" in KanbanBoard.jsx
2. RequestModal.jsx opens with form
3. User selects equipment
4. handleEquipmentChange triggers auto-fill
5. Equipment category and team auto-populate
6. User completes form and submits
7. api.js sends POST to /api/requests
8. Backend creates request in MongoDB
9. Response sent back to frontend
10. App.jsx reloads data
11. KanbanBoard.jsx updates with new request

### Drag and Drop Flow

1. User drags RequestCard.jsx
2. handleDragStart captures request data
3. User drops on different stage column
4. handleDrop updates request stage
5. api.js sends PUT to /api/requests/:id
6. Backend updates request in MongoDB
7. If stage is "Scrap", equipment status updated
8. Response sent back to frontend
9. App.jsx reloads data
10. UI updates with new positions

### Equipment Smart Button Flow

1. User clicks "Maintenance Requests" button
2. handleViewRequests called with equipment ID
3. api.js fetches /api/equipment/:id/requests
4. api.js fetches /api/equipment/:id/requests/count
5. Modal displays filtered requests
6. Badge shows count of open requests

## Styling Architecture

### Tailwind CSS
- Utility-first CSS framework
- Responsive design classes
- Custom color palette

### Custom CSS
- Soft elevation effects (shadow-soft, elevation-1 to 4)
- Glass effects for modern look
- Gradient borders
- Custom animations (fade-in, slide-in)
- Scrollbar styling

### Design System
- Primary: Blue (#3b82f6)
- Secondary: Slate gray
- Success: Green
- Warning: Amber
- Error: Red
- Soft shadows for elevation
- Rounded corners for cards
- Gradient backgrounds

## State Management

### Component State
- Local state with useState
- Props for component communication
- Lifting state up pattern

### Data Loading
- Centralized in App.jsx
- loadData function refreshes all data
- Passed as onUpdate callback to children
- Loading states for better UX

## API Integration

### REST API Pattern
- RESTful endpoints
- JSON request/response
- Error handling
- CORS enabled

### API Client
- Centralized in api.js
- Fetch API wrapper
- Error handling
- Response parsing

## Development Workflow

### Frontend Development
1. Edit components in `src/components/`
2. Hot module replacement (HMR) updates instantly
3. View changes at http://localhost:5173

### Backend Development
1. Edit files in `backend/`
2. Server restarts with nodemon
3. Test API at http://localhost:5000

### Production Build
1. Run `npm run build`
2. Output to `dist/` folder
3. Deploy static files and backend separately

## Key Technical Decisions

### Why MongoDB?
- Flexible schema for equipment variations
- Easy to scale
- Local development friendly
- Rich query capabilities

### Why React?
- Component-based architecture
- Large ecosystem
- Virtual DOM for performance
- Hooks for state management

### Why Express?
- Lightweight and flexible
- Large middleware ecosystem
- Easy to understand
- RESTful API support

### Why Vite?
- Fast HMR
- Optimized builds
- Modern tooling
- Great developer experience

### Why Tailwind CSS?
- Rapid development
- Consistent design
- Small production bundle
- Utility-first approach

## Extension Points

Want to add features? Here's where:

### New Equipment Field
1. Add to Equipment.js model
2. Update equipmentRoutes.js
3. Update EquipmentManager.jsx form

### New Request Stage
1. Update MaintenanceRequest.js enum
2. Add stage to KanbanBoard.jsx stages array
3. Add color to stageColors object

### New View
1. Create component in `src/components/`
2. Add route in App.jsx renderView()
3. Add menu item in Sidebar.jsx

### New API Endpoint
1. Add route handler in appropriate routes file
2. Add method in api.js
3. Use in component

## Performance Considerations

### Frontend
- Component memoization where needed
- Efficient re-renders with proper keys
- Lazy loading potential for future
- Optimized bundle size

### Backend
- Database indexing on frequently queried fields
- Proper error handling
- Connection pooling
- Efficient queries with populate

### Database
- Indexed fields: serialNumber, equipment ID
- Proper schema design
- Relationship optimization

## Security Considerations

### Backend
- Input validation
- CORS configuration
- Error messages don't expose internals
- Ready for authentication addition

### Frontend
- Client-side validation
- Safe data handling
- XSS prevention with React
- CSRF protection ready

## Testing Strategy

### Manual Testing
- Test each CRUD operation
- Test drag and drop
- Test auto-fill logic
- Test smart buttons
- Test calendar scheduling

### Future Testing
- Unit tests for components
- Integration tests for API
- End-to-end tests for workflows

This structure provides a solid foundation for maintenance management while remaining extensible for future enhancements.
