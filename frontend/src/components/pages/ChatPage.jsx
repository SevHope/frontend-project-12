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
        const channelsData = await axios.get(routes.channelsPath(), {
          headers: getAuthHeader(),
        });
        const messagesData = await axios.get(routes.messagesPath(), {
          headers: getAuthHeader(),
        });
        console.log(response.data.channels, 'response v chatPage');
        console.log(messagesData, 'messagesData');
        dispatch(channelsActions.setChannels(channelsData.data));
        dispatch(messagesActions.setMessages(messagesData.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [dispatch, auth, navigate]);

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
