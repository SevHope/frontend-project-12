/* eslint-disable */

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

import LoginPage from './components/pages/LoginPage.jsx';
import ChatPage from './components/pages/ChatPage.jsx';
import AuthContext from './contexts/index.jsx';
import useAuth from './hooks/index.jsx';

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
  console.log(children, 'children');

  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
}

function AuthButton() {
  const auth = useAuth();
  const location = useLocation();
  console.log(auth, 'auth v app');

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} as={Link} to="/login" state={{ from: location }}>Выйти</Button>
      : null
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar bg="light" expand="lg">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Chat page</Nav.Link>
          </Nav>
          <AuthButton />
        </Navbar>

        <div className="container p-3">
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
          </Routes>
        </div>

      </Router>
    </AuthProvider>
  );
}

export default App;
