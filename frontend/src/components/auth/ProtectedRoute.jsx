import React from 'react';
import { Navigate } from 'react-router-dom';
import useAppStore from '../../state/appStore';

const ProtectedRoute = ({ children }) => {
  // Get the authentication status from our global state
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the component they were trying to access
  return children;
};

export default ProtectedRoute;