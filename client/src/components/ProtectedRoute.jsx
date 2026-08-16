import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// roles: optional array, e.g. ['admin', 'reporter']. Omit to just require login.
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
