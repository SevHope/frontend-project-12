import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
// import i18next from 'i18next';
import { actions as messagesActions } from './slices/messagesSlice';
import { actions as channelsActions, defaultChannelId } from './slices/channelsSlice';
// import resources from './locales/index';

export default async () => {
  const socket = io();
  const dispatch = useDispatch();
  const channelIdActive = useSelector((state) => state.channelsReducer.channelId);
  socket.on('newMessage', (payload) => {
    console.log('srabotal socket newMessage');
    dispatch(messagesActions.addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    console.log('srabotal socket newChannel');
    console.log(payload, 'payload v soket');
    const { username } = JSON.parse(localStorage.getItem('userId'));
    if (payload.author === username) {
      dispatch(channelsActions.setChannelId(payload.id));
    }
    dispatch(channelsActions.addChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    if (payload.id === channelIdActive) {
      dispatch(channelsActions.setChannelId(defaultChannelId));
    }
    dispatch(channelsActions.removeChannel(payload));
  });
  socket.on('renameChannel', (payload) => {
    dispatch(channelsActions.renameChannel(payload));
  });
};
