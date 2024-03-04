/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap';
import LoginPage from './components/pages/LoginPage';
import ChatPage from './components/pages/ChatPage';
import RegistrationPage from './components/pages/RegistrationPage';
import AuthContext from './contexts/auth';
import useAuth from './hooks/auth';
import runInit from './init';

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

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} as={Link} to="/login" state={{ from: location }}>Выйти</Button>
      : null
  );
}

function App() {
  runInit();
  return (
    <AuthProvider>
      <Router>
        <Navbar bg="light" expand="lg">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Hexlet chat</Nav.Link>
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
        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;
