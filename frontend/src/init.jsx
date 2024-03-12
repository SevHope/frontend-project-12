/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { io } from 'socket.io-client';
import i18next from 'i18next';
import { BrowserRouter } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { I18nextProvider, initReactI18next } from 'react-i18next';
// import SocketProvider from './components/SocketProvider';
import { actions as messagesActions } from './slices/messagesSlice';
import { actions as channelsActions } from './slices/channelsSlice';
import resources from './locales/index';
import App from './App';
import slices from './slices';

const init = async () => {
  const socket = io();
  // const channelIdActive = useSelector((state) => state.channelsReducer.channelId);
  const defaultLanguage = 'ru';
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
  socket.on('newMessage', (payload) => {
    console.log('srabotal socket newMessage');
    slices.dispatch(messagesActions.addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    console.log('srabotal socket newChannel');
    console.log(payload, 'payload v soket');
    const { username } = JSON.parse(localStorage.getItem('userId'));
    if (payload.author === username) {
      slices.dispatch(channelsActions.setChannelId(payload.id));
    }
    slices.dispatch(channelsActions.addChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    slices.dispatch(channelsActions.removeChannel(payload));
  });
  socket.on('renameChannel', (payload) => {
    slices.dispatch(channelsActions.renameChannel(payload));
  });

  return (
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </React.StrictMode>
  );
};

export default init;