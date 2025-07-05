// src/Customer/CustomerProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const CustomerProtectedRoute = ({ children }) => {
  const customer = JSON.parse(localStorage.getItem('user'));

  if (!customer) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default CustomerProtectedRoute;
