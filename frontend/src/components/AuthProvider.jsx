/* eslint-disable react/prop-types */
import React, {
  useState, useMemo, useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/auth';
import routes from '../routes';

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const getUser = JSON.parse(localStorage.getItem('userId'));
  console.log(getUser, 'getUser');
  const [token, setToken] = useState(getUser ?? null);

  const logIn = useCallback((response) => {
    const data = JSON.stringify(response.data);
    localStorage.setItem('userInfo', data);
    setToken(data);
    navigate(routes.chatPagePath());
  }, [navigate]);

  const logOut = useCallback(() => {
    localStorage.removeItem('userInfo');
    navigate(routes.loginPagePath());
  }, [navigate]);

  const context = useMemo(() => ({
    token,
    setToken,
    logOut,
    logIn,
  }), [token, setToken, logOut, logIn]);

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
