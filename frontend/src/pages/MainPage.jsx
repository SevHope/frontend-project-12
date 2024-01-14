import { Link } from 'react-router-dom';

export const MainPage = () => (
    <nav>
      <ul>
        <li>
          <Link to="/login">Login page</Link>
        </li>
        <li>
          <Link to="/error">error page</Link>
        </li>
      </ul>
    </nav>
  );