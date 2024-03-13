import ReactDOM from 'react-dom/client';
import init from './init';

const application = async () => {
  const chat = ReactDOM.createRoot(document.getElementById('root'));
  chat.render(await init());
};

application();
