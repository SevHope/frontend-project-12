import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import filterWords from 'leo-profanity';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import SendIcon from '../images/Send';

const Messages = () => {
  const [message, setMessage] = useState('');
  const auth = useAuth();
  const user = auth.getUser;
  const { t } = useTranslation();
  const allChannels = useSelector((state) => state.channelsReducer.channels);
  const channelIdActive = useSelector((state) => state.channelsReducer.channelId);
  const allMessages = useSelector((state) => state.messagesReducer.messages);
  const noNetworkError = () => toast.error(t('error.networkError'));
  const dataLoadingError = () => toast.error(t('error.dataLoadingError'));
  const messagesBoxRef = useRef();

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
    inputRef.value = null;
  }, []);

  const channelMessages = allMessages.filter((mes) => mes.channelid === channelIdActive);
  const messagesBox = channelMessages.map(({ username, id, body }) => {
    const isCurrentUser = username === user.username;
    const messageClasses = isCurrentUser ? 'bg-light' : 'bg-transparent';
    return (
      <div className={`text-break mb-2 ${messageClasses}`} key={id}>
        <b>{username}</b>
        <span>: </span>
        {filterWords.clean(body)}
      </div>
    );
  });
  useEffect(() => {
    if (messagesBoxRef.current) {
      messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
    }
  }, [messagesBox]);

  const activeChannelId = (channelItem) => {
    const filter = channelItem.find((channel) => channel.id === channelIdActive);
    return filter ? filterWords.clean(filter.name) : t('channels.notFoundChannel');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const currentName = user.username;
    const newMessage = {
      body: filterWords.clean(message),
      channelid: channelIdActive,
      username: currentName,
    };
    try {
      await axios.post('/api/v1/messages', newMessage, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMessage('');
    } catch (error) {
      if (error.message === 'Network Error') {
        noNetworkError();
      }
      if (error.status === 500) {
        dataLoadingError();
      }
    }
  };

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {' '}
              {activeChannelId(allChannels)}
              {' '}
            </b>
          </p>
          <span className="text-muted">
            {`${channelMessages.length} ${t('chat.messagesCounter.messages', { count: (channelMessages.length) })}`}
          </span>
        </div>
        <div id="messages-box" ref={messagesBoxRef} className="chat-messages overflow-auto px-5 ">
          {messagesBox}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form noValidate="" className="py-1 border rounded-2" onSubmit={sendMessage}>
            <div className="input-group has-validation">
              <Form.Label htmlFor="body" />
              <Form.Control
                name="body"
                className="border-0 p-0 ps-2 form-control"
                placeholder={t('chat.enterMessage')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                ref={inputRef}
                aria-label={t('chat.newMessage')}
              />
              <Button
                type="submit"
                className="btn btn-group-vertical"
                disabled={!message}
              >
                <SendIcon />
                <span className="visually-hidden">{t('chat.send')}</span>
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
