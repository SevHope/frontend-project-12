import React from 'react';
import { useSelector } from 'react-redux';

function Messages() {
  const messages = useSelector((state) => state.messagesreducer) || { messages: [] };
  console.log(messages, 'messages');
  return (
    <div className="mt-3">
      {messages.messages.length > 0 ? (
        messages.messages.data.map((message) => (
          <div key={message.id}>
            #
            {message.id}
            {' '}
            {message.name}
          </div>
        ))
      ) : (
        <div>
          No messages
        </div>
      )}
    </div>
  );
}

export default Messages;
