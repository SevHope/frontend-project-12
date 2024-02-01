import React from 'react';
import { io } from 'socket.io-client';
import App from './App';
import AuthProvider from './components/AuthProvider';
import SocketProvider from './components/SocketProvider';

const init = async () => {
  const socket = io();
  socket.on('message', (message) => {
    console.log(message);
  });
  socket.emit('message', 'Hello, my name is Client');

  return (
    <AuthProvider>
      <SocketProvider socket={socket}>
        <App />
      </SocketProvider>
    </AuthProvider>
  );
};

export default init;
