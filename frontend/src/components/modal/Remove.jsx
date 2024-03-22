import React, { useState } from 'react';
import {
  Modal, FormGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from '../../routes';
import { actions as channelsActions } from '../../slices/channelsSlice';
import { actions as messagesActions } from '../../slices/messagesSlice';

const Remove = ({ onHide, item }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notify = () => toast.success(t('channels.channelDeleted'));
  const noNetworkError = () => toast.error(t('error.networkError'));
  const dataLoadingError = () => toast.error(t('error.dataLoadingError'));
  const allChannels = useSelector((state) => state.channelsReducer.channels) || [];
  const allMessages = useSelector((state) => state.messagesReducer.messages) || [];
  const { token } = JSON.parse(localStorage.getItem('userInfo'));
  const channelMessages = allMessages.filter((message) => message.channelid === item);
  const generateOnSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    axios.delete(`${routes.channelsPath()}/${item}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => Promise.all(channelMessages.map(async (message) => {
        await axios.delete(`${routes.messagesPath()}/${message.id}`, { headers: { Authorization: `Bearer ${token}` } });
      })))
      .then(() => {
        setIsSubmitting(false);
        const updatedChannels = allChannels.filter((channel) => channel.id !== item);
        const updatedMessages = allMessages.filter((message) => message.channelId !== item);
        dispatch(channelsActions.setChannels(updatedChannels));
        dispatch(messagesActions.setMessages(updatedMessages));
        onHide();
        notify();
      })
      .catch((error) => {
        if (error.message === 'Network Error') {
          noNetworkError();
        }
        if (error.response.status === 500) {
          dataLoadingError();
        }
        setIsSubmitting(false);
      });
  };
  return (
    <Modal show centered>
      <Modal.Header closeButton onClick={onHide}>
        <Modal.Title className="modal-title h4">{t('modals.deleteChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={generateOnSubmit}>
          <p className="lead">{t('modals.sure')}</p>
          <FormGroup>
            <button type="button" disabled={isSubmitting} className="btn btn-secondary mt-2" onClick={onHide}>{t('modals.cancel')}</button>
            <button type="submit" disabled={isSubmitting} className="btn btn-danger mt-2 ml-2">{t('modals.delete')}</button>
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Remove;
