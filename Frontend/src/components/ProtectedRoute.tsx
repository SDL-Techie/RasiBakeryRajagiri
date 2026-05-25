import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext'; 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Destructured exact properties provided by your CustomerAuthContext Type
  const { isLoggedIn, authLoading } = useCustomerAuth(); 
  const location = useLocation();

  // Prevents the application from flashes or premature routing jumps
  if (authLoading) {
    return (
      <div className="rasi-loading-screen">
        <div className="rasi-spinner"></div>
        <p>Verifying session...</p>
      </div>
    );
  }

  // If the user isn't logged in, redirect them seamlessly to your login screen
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;