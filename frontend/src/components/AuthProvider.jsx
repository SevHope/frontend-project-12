import React, {
  useState, useMemo, useCallback,
} from 'react';
import AuthContext from '../contexts/AuthContext';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userToken, setToken] = useState(null);
  const [userName, setName] = useState(null);

  const getUser = useCallback(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      return null;
    } const { token, username } = userInfo;
    setToken(token);
    setName(username);
    return { token, username };
  });
  const logIn = useCallback((response) => {
    const data = JSON.stringify(response.data);
    localStorage.setItem('userInfo', data);
    setLoggedIn(true);
    setToken(response.data.token);
    setName(response.data.username);
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('userInfo');
    setLoggedIn(false);
    setToken(null);
    setName(null);
  }, []);

  const context = useMemo(() => ({
    logOut,
    logIn,
    loggedIn,
    userToken,
    getUser,
  }), [logOut, logIn, loggedIn, userToken, userName, getUser]);

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
