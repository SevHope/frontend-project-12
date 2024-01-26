/* eslint-disable */

import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/index';
import routes from '../../routes';
import Channels from '../Channels';
import Messages from '../Messages';
import { actions as channelsActions } from '../../slices/channelsSlice';
import { actions as messagesActions } from '../../slices/messagesSlice';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  console.log(userId, 'userId');

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};

function ChatPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  console.log(auth, 'auth v chate');
  console.log(localStorage.getItem('userInfo'), 'local');
  console.log(getAuthHeader(), 'getAuth');
  console.log([navigate], 'navigate');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(routes.usersPath(), {
          headers: getAuthHeader(),
        });
        console.log(response);
        dispatch(channelsActions.setChannels(response.data.channels));
        dispatch(messagesActions.setMessages(response.data.messages));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [dispatch, auth]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </div>
  );
}

export default ChatPage;
