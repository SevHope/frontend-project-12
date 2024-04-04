import React, {
  useState, useMemo, useCallback,
} from 'react';
import AuthContext from '../contexts/AuthContext';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const getUser = JSON.parse(localStorage.getItem('userInfo'));

  const logIn = useCallback((response) => {
    const data = JSON.stringify(response.data);
    localStorage.setItem('userInfo', data);
    setLoggedIn(true);
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('userInfo');
    setLoggedIn(false);
  }, []);

  const context = useMemo(() => ({
    logOut,
    logIn,
    loggedIn,
    getUser,
  }), [logOut, logIn, loggedIn, getUser]);

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
