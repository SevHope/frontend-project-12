/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LoginPage from './components/pages/LoginPage';
import ChatPage from './components/pages/ChatPage';
import RegistrationPage from './components/pages/RegistrationPage';
import AuthContext from './contexts/Auth';
import useAuth from './hooks/auth';
import store from './slices/index';
import ErrorPage from './components/pages/ErrorPage';

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };
  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function PrivateRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
}

function AuthButton() {
  const auth = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} as={Link} to="/login" state={{ from: location }}>{t('header.goOut')}</Button>
      : null
  );
}

function App() {
  const { t } = useTranslation();
  return (
    <Provider store={store}>
      <AuthProvider>
        <Navbar bg="light" expand="lg">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">{t('header.mainHeader')}</Nav.Link>
          </Nav>
          <AuthButton />
        </Navbar>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            )}
          />
          <Route
            path="/chat"
            element={(
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            )}
          />
          <Route
            path="/signup"
            element={(
              <RegistrationPage />
            )}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AuthProvider>
    </Provider>
  );
}

export default App;
