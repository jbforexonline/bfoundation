import { Navigate, useLocation } from 'react-router-dom';
import { DASHBOARD_PATHS, useAuth } from './AuthContext';

// Protects a dashboard: not logged in → home page with the login form open;
// logged in with another role → that user's own dashboard.
export default function RequireRole({ roles, children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready && !user) return null;
  if (!user) return <Navigate to={`/?login=1&next=${encodeURIComponent(location.pathname)}`} replace />;
  if (!roles.includes(user.role)) return <Navigate to={DASHBOARD_PATHS[user.role] ?? '/'} replace />;
  return children;
}
