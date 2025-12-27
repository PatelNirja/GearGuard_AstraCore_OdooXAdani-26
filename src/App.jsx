import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Calendar from './pages/Calendar';
import Equipment from './pages/Equipment';
import Teams from './pages/Teams';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

function App() {
  const { theme, toggle } = useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout theme={theme} onToggleTheme={toggle} />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />
          <Route 
            path="/teams" 
            element={
              <RoleProtectedRoute allowedRoles={['TECHNICIAN', 'MANAGER']}>
                <Teams />
              </RoleProtectedRoute>
            } 
          />
        </Route>

        {/* Backward compatibility redirect */}
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
