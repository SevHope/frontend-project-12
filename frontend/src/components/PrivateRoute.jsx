/* eslint-disable react/prop-types */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/auth';

function PrivateRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
}

export default PrivateRoute;
