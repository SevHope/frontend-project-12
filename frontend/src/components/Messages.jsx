import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
// import { actions as messagesActions } from '../slices/messagesSlice';

function Messages() {
  const messages = useSelector((state) => state.messagesReducer) || [];
  console.log(messages, 'messages');
  const [message, setMessage] = useState('');
  // const dispatch = useDispatch();
  const { token } = JSON.parse(localStorage.getItem('userId'));

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
    inputRef.value = null;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log(localStorage.getItem('userId'), 'localStorage.getItem(userId)');
    const currentName = JSON.parse(localStorage.getItem('userId')).username;
    console.log(token, 'token');
    console.log(currentName, 'currentname');
    const newMessage = { body: message, channelid: '1', username: currentName };
    console.log(newMessage, 'newMessage');
    try {
      await axios.post('/api/v1/messages', newMessage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending or fetching messages:', error);
    }
  };

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              # general
              {' '}
              {' '}
            </b>
          </p>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {messages.messages.map((item) => (
            <div key={item.id}>
              {'  '}
              <b>
                {item.username}
              </b>
              :
              {'  '}
              {item.body}
            </div>
          ))}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form noValidate="" className="py-1 border rounded-2" onSubmit={sendMessage}>
            <div className="input-group has-validation">
              <Form.Control
                name="body"
                className="border-0 p-0 ps-2 form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                ref={inputRef}
              />
              <Button
                type="submit"
                className="btn btn-group-vertical"
                disabled={!message}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                  />
                </svg>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Messages;
