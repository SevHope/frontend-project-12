/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Modal, FormGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import { actions as channelsActions } from '../../slices/channelsSlice';
import { actions as messagesActions } from '../../slices/messagesSlice';

async function deleteMessages(channelMessages, token) {
  try {
    await Promise.all(channelMessages.map(async (message) => {
      await axios.delete([routes.messagesPath(), message.id].join('/'), { headers: { Authorization: `Bearer ${token}` } });
    }));
  } catch (error) {
    console.log(error, 'error v udalenii soobchenii');
  }
}
function Remove({ onHide, item }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
  const allMessages = useSelector((state) => state.messagesReducer.messages) || [];
  const channelMessages = allMessages.filter((message) => message.channelid === item);
  const generateOnSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { token } = JSON.parse(localStorage.getItem('userId'));
    try {
      await axios.delete([routes.channelsPath(), item].join('/'), { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.log(error, 'error v udalenii');
    } finally {
      setIsSubmitting(false);
    }
    deleteMessages(channelMessages, token);
    const updatedChannels = allChannels.filter((channel) => channel.id !== item);
    const updatedMessages = allMessages.filter((message) => message.channelid !== item);
    dispatch(channelsActions.setChannels(updatedChannels));
    dispatch(messagesActions.setMessages(updatedMessages));
    onHide();
  };
  return (
    <Modal show centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('modals.deleteChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={generateOnSubmit}>
          <p className="lead">{t('modals.sure')}</p>
          <FormGroup>
            <input type="reset" disabled={isSubmitting} className="btn btn-secondary mt-2" value={t('modals.cancel')} onClick={onHide} />
            <input type="submit" disabled={isSubmitting} className="btn btn-danger mt-2 ml-2" value={t('modals.delete')} />
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Remove;
