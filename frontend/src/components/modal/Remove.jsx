/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Modal, FormGroup,
} from 'react-bootstrap';
// import { useSelector } from 'react-redux';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import routes from '../../routes';
import { actions as channelsActions } from '../../slices/channelsSlice';
import { actions as messagesActions } from '../../slices/messagesSlice';

async function deleteMessages(channelMessages, token) {
  try {
    await Promise.all(channelMessages.map(async (message) => {
      await axios.delete([routes.messagesPath(), message.id].join('/'), { headers: { Authorization: `Bearer ${token}` } });
    }));

    console.log('soobwenia udaleny');
  } catch (error) {
    console.log(error, 'error v udalenii soobchenii');
  }
}
function Remove({ onHide, item }) {
  const dispatch = useDispatch();
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
  const allMessages = useSelector((state) => state.messagesReducer.messages) || [];
  const channelMessages = allMessages.filter((message) => message.channelid === item);
  console.log(channelMessages, 'channelMessages');
  const generateOnSubmit = async (e) => {
    e.preventDefault();
    console.log('udalenie kanala');
    console.log(onHide, 'onhide v edalenii');
    console.log(item, 'item v udalenii');
    console.log([routes.channelsPath(), item].join('/'), 'posmotret put');
    const { token } = JSON.parse(localStorage.getItem('userId'));
    try {
      await axios.delete([routes.channelsPath(), item].join('/'), { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.log(error, 'error v udalenii');
    }
    deleteMessages(channelMessages, token);
    const updatedChannels = allChannels.filter((channel) => channel.id !== item);
    const updatedMessages = allMessages.filter((message) => message.channelid !== item);
    dispatch(channelsActions.setChannels(updatedChannels));
    console.log(allMessages, 'allMessages posle udalenia kanala');
    console.log(updatedMessages, 'updatedmessages');
    dispatch(messagesActions.setMessages(updatedMessages));
    onHide();
  };
  console.log(item, 'item v Remove');
  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={generateOnSubmit}>
          <p className="lead">Уверены?</p>
          <FormGroup>
            <input type="reset" className="btn btn-secondary mt-2" value="Отменить" onClick={onHide} />
            <input type="submit" className="btn btn-danger mt-2 ml-2" value="Удалить" />
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Remove;
