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
import { io } from 'socket.io-client';
import LoginPage from './components/pages/LoginPage';
import ChatPage from './components/pages/ChatPage';
import AuthContext from './contexts/auth';
import useAuth from './hooks/auth';
import { actions as messagesActions } from './slices/messagesSlice';
import slice from './slices/index';

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
  const socket = io();

  socket.on('newMessage', (payload) => {
    slice.dispatch(messagesActions.addMessage(payload));
  });
  return (
    <AuthProvider>
      <Router>
        <Navbar bg="light" expand="lg">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Chat page</Nav.Link>
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
        </Routes>

      </Router>
    </AuthProvider>
  );
}

export default App;
