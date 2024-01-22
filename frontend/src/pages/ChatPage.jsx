/* eslint-disable */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const ChatPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem('userInfo')) {
      navigate(routes.loginPagePath());
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(routes.usersPath(), {
          headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` },
        });
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
};

export default ChatPage;