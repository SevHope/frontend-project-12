import React from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';
import { io } from 'socket.io-client';
import i18next from 'i18next';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import filterWords from 'leo-profanity';
import AuthProvider from './components/AuthProvider';
import { actions as messagesActions } from './slices/messagesSlice';
import { actions as channelsActions } from './slices/channelsSlice';
import resources from './locales/index';
import App from './App';
import slices from './slices';

const Init = async () => {
  const socket = io();
  const defaultLanguage = 'ru';
  filterWords.add(filterWords.getDictionary('ru'));
  filterWords.add(filterWords.getDictionary('en'));
  const rollbarConfig = {
    accessToken: process.env.ACCESS_TOKEN,
    environment: 'testenv',
  };
  const i18n = i18next.createInstance();

  await i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });
  socket.on('newMessage', (payload) => {
    slices.dispatch(messagesActions.addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    slices.dispatch(channelsActions.addChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    slices.dispatch(channelsActions.removeChannel(payload));
  });
  socket.on('renameChannel', (payload) => {
    slices.dispatch(channelsActions.renameChannel(payload));
  });

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <React.StrictMode>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <AuthProvider>
                <App />
              </AuthProvider>
            </BrowserRouter>
          </I18nextProvider>
        </React.StrictMode>
      </ErrorBoundary>
    </Provider>
  );
};

export default Init;
