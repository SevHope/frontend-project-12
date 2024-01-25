/* eslint-disable */

import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  console.log(userId, 'userId');

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const ChatPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  console.log(auth, 'auth v chate');
  console.log(localStorage.getItem('userInfo'), 'local');
  console.log(getAuthHeader(), 'getAuth');
  console.log([navigate], 'navigate');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(routes.channelsPath(), {
          headers: getAuthHeader(),
        });
        console.log(response, 'response');
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  });

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        Welcome chat!
      </div>
    </div>
  );
}

export default ChatPage;
