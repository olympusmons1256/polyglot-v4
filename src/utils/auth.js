import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const ProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated();

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;