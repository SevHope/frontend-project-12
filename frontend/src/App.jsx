/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React from 'react';
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
import { ToastContainer } from 'react-toastify';
import LoginPage from './components/pages/LoginPage';
import ChatPage from './components/pages/ChatPage';
import RegistrationPage from './components/pages/RegistrationPage';
import useAuth from './hooks/auth';
import store from './slices/index';
import ErrorPage from './components/pages/ErrorPage';

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
      <ToastContainer />
    </Provider>
  );
}

export default App;
