import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Roles allowed to access this route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, userDetails } = useAuth(); // Get userDetails from context
  const roles = userDetails.roles; // Extract roles from userDetails
  const location = useLocation(); // Get current location to redirect back after login

  // If still checking auth state, don't render anything yet (or show loading)
  // This prevents flashing the protected content briefly before redirecting
  if (isLoading) {
    return <div>Checking authentication...</div>; // Or a spinner
  }

  // If authenticated, render the child route component using <Outlet />
  if (isAuthenticated) {
    // Check if allowedRoles is provided and if the user has at least one of them
    const hasRequiredRole = allowedRoles ? allowedRoles.some(role => roles.includes(role)) : true;

    if (hasRequiredRole) {
      return <Outlet />; // User is authenticated and has the required role (or no specific role is required)
    } else {
      // User is authenticated but does not have the required role
      // Redirect to a safe page, like the dashboard
      console.warn(`Redirecting: User with roles [${roles.join(', ')}] tried to access route requiring [${allowedRoles?.join(', ')}]`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If not authenticated, redirect to the login page
  // Pass the current location in state so we can redirect back after login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;