/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { actions as messagesActions } from '../slices/messagesSlice';

function NewMessageForm() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  const handleAddMessage = (e) => {
    e.preventDefault();
    const message = { text, id: _.uniqueId() };
    console.log(message, 'text сообщения');
    dispatch(messagesActions.addMessage(message));
    setText('');
  };

  const handleUpdateNewMessageText = (e) => setText(e.target.value);

  return (
    <form action="" className="form-inline" onSubmit={handleAddMessage}>
      <div className="form-group mx-sm-3">
        <input
          type="text"
          data-testid="input"
          required
          value={text}
          onChange={handleUpdateNewMessageText}
        />
      </div>
      <input type="submit" data-testid="submit" className="btn btn-primary btn-sm" value="Add" />
    </form>
  );
}

export default NewMessageForm;
