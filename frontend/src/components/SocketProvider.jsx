import React, { useMemo, useCallback } from 'react';
import SocketContext from '../contexts/SocketContext';

const SocketProvider = ({ socket, children }) => {
  console.log('srabotal socket v providere');
  const addChannel = useCallback((values) => {
    console.log(values, 'values');
    socket.emit('newChannel', { name: values.name }, (response) => {
      console.log(response, 'response');
    });
  });

  const context = useMemo(() => ({
    addChannel,
  }), [addChannel]);

  return (
    <SocketContext.Provider value={context}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
