import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import 'react-toastify/dist/ReactToastify.css';
import routes from '../../routes';
import Channels from '../Channels';
import Messages from '../Messages';
import { actions as channelsActions } from '../../slices/channelsSlice';
import { actions as messagesActions } from '../../slices/messagesSlice';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userInfo'));
  console.log(userId, 'userId');
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};

const ChatPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!localStorage.getItem('userInfo')) {
      navigate(routes.loginPagePath());
    }
  });

  useEffect(() => {
    const noNetworkError = () => toast.error(t('error.networkError'));
    const dataLoadingError = () => toast.error(t('error.dataLoadingError'));

    const fetchData = async () => {
      try {
        const channelsData = await axios.get(routes.channelsPath(), {
          headers: getAuthHeader(),
        });
        const messagesData = await axios.get(routes.messagesPath(), {
          headers: getAuthHeader(),
        });
        dispatch(channelsActions.setChannels(channelsData.data));
        dispatch(messagesActions.setMessages(messagesData.data));
      } catch (err) {
        if (err.message === 'network error') {
          noNetworkError();
        }
        if (err.status === 500) {
          dataLoadingError();
        }
        navigate(routes.loginPagePath());
      }
    };
    fetchData();
  }, [dispatch, auth, navigate, t]);

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <Channels />
        <Messages />
      </div>
    </div>
  );
};

export default ChatPage;
