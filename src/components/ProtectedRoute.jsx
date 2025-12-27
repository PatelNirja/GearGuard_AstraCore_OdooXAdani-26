import { Navigate } from 'react-router-dom';
import { authStore } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  const token = authStore.getToken();
  
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return children;
}

