import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import routes from '../routes';

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.getUser !== null ? children
      : <Navigate to={routes.loginPagePath()} state={{ from: location }} />
  );
};

export default PrivateRoute;
