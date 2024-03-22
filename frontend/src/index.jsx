import ReactDOM from 'react-dom/client';
import Init from './init';

const application = async () => {
  const chat = ReactDOM.createRoot(document.getElementById('root'));
  chat.render(await Init());
};

application();
