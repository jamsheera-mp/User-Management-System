

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, adminOnly = false }) => {

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Check if user is an admin
  const isAdmin = user?.isAdmin;

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin-only page & user is not an admin, redirect to user profile
  if (adminOnly && !isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  // If the user is an admin and they are trying to access a non-admin route, redirect to admin dashboard
  if (isAdmin && !adminOnly) {
    return <Navigate to="/admin/dashboard" replace />;
  }


  return children;
};

export default ProtectedRoute;
