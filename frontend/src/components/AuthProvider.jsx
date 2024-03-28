import React, {
  useState, useMemo, useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import routes from '../routes';

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = useCallback((response) => {
    const data = JSON.stringify(response.data);
    localStorage.setItem('userInfo', data);
    setLoggedIn(true);
    navigate(routes.chatPagePath());
  }, [navigate]);

  const logOut = useCallback(() => {
    localStorage.removeItem('userInfo');
    setLoggedIn(false);
    navigate(routes.loginPagePath());
  }, [navigate]);

  const context = useMemo(() => ({
    logOut,
    logIn,
    loggedIn,
  }), [logOut, logIn, loggedIn]);

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
