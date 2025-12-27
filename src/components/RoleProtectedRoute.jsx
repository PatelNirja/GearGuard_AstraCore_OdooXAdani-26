import { Navigate } from 'react-router-dom';
import { authStore } from '../utils/auth';

export default function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const user = authStore.getUser();
  const userRole = user?.role?.toUpperCase() || 'USER';
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

