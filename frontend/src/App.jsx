/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React from 'react';
import { Provider } from 'react-redux';
import {
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import LoginPage from './components/pages/LoginPage';
import ChatPage from './components/pages/ChatPage';
import RegistrationPage from './components/pages/RegistrationPage';
import store from './slices/index';
import ErrorPage from './components/pages/ErrorPage';
import PrivateRoute from './components/PrivateRoute';
import AuthButton from './components/AuthButton';

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
