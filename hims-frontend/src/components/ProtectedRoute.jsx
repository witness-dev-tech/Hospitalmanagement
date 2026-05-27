import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const sessionUser = localStorage.getItem('user');
  
  if (!sessionUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}