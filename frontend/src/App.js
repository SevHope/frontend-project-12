//import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { MainPage } from './pages/MainPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { ErrorPage } from './pages/ErrorPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
