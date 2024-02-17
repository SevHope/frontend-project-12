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

function Remove({ onHide, item }) {
  const dispatch = useDispatch();
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
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
    const updatedChannels = allChannels.filter((channel) => channel.id !== item);
    dispatch(channelsActions.setChannels(updatedChannels));
    onHide();
  };
  console.log(item, 'item v Remove');
  return (
    <Modal show centered>
      <Modal.Header>
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
