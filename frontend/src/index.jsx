// import React from 'react';
import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import App from './App';
import init from './init';
// import store from './slices/index';

const application = async () => {
  const chat = ReactDOM.createRoot(document.getElementById('root'));
  chat.render(await init());
};

application();
