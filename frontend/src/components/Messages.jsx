/* eslint-disable */

import React from 'react';
import { useSelector } from 'react-redux';

const Messages = () => {
  const { messages } = useSelector((state) => state.messagesReducer);

  return (
    <div className="mt-3">
      {messages}
    </div>
  );
};

export default Messages;
