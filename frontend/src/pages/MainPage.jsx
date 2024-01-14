/* eslint-disable */

import { Link, Outlet } from 'react-router-dom';

export const MainPage = () => {
    return (
    <>
    <nav>
      <ul>
      <li>
          <Link to="/">Main page</Link>
        </li>
        <li>
          <Link to="/login">Login page</Link>
        </li>
        <li>
          <Link to="/error">error page</Link>
        </li>
      </ul>
    </nav>
    <hr />
    <Outlet />
    </>
    )
    };