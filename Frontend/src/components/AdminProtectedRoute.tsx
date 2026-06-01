import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute: React.FC = () => {
  // 1. Grab the role you stored during the login process
  const userRole = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  // 2. Check if they are logged in AND if their role is strictly 'admin'
  if (token && userRole === 'admin') {
    // Access granted! Render the admin pages inside
    return <Outlet />;
  }

  // 3. Access denied! Push them back to the customer home page
  return <Navigate to="/" replace />;
};

export default AdminProtectedRoute;