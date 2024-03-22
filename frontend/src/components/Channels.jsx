import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
// eslint-disable-next-line import/no-extraneous-dependencies
import filterWords from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../slices/channelsSlice';
import getModal from './modal/index';

const renderModal = ({
  modalInfo, hideModal, setItems,
}) => {
  if (!modalInfo.type) {
    return null;
  }
  const Component = getModal(modalInfo.type);
  return (
    <Component
      modalInfo={modalInfo}
      setItems={setItems}
      onHide={hideModal}
      item={modalInfo.item}
    />
  );
};

function Channels() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channelsReducer) || [];
  const channelIdActive = useSelector((state) => state.channelsReducer.channelId);
  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });

  const setChannelActive = (id) => {
    dispatch(channelsActions.setChannelId(id));
  };

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <span className="bold-text">{t('channels.channels')}</span>
        <button
          type="button"
          className="p-0 text-primary btn btn-group-vertical"
          onClick={() => showModal('adding')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">{t('channels.plus')}</span>
        </button>
      </div>
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.channels.map((channel) => (
          <li key={channel.id} className="nav-item w-100">
            {channel.removable && (
              <div role="group" className="d-flex dropdown text-start btn-group">
                <button
                  type="button"
                  id={channel.id}
                  className={channel.id === channelIdActive ? 'w-100 rounded-0 text-start text-truncate btn' : 'w-100 text-truncate rounded-0 text-start btn'}
                  onClick={() => setChannelActive(channel.id)}
                >
                  <span className="me-1">#</span>
                  {' '}
                  {filterWords.clean(channel.name)}
                </button>
                <Dropdown as={ButtonGroup}>
                  <Dropdown.Toggle split variant="bg-light" id={channel.id}>
                    <span className="visually-hidden">{t('modals.channelManagement')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item id={channel.id} onClick={(e) => showModal('removing', e.target.id)}>
                      {t('channels.delete')}
                    </Dropdown.Item>
                    <Dropdown.Item id={channel.id} name={channel.name} onClick={(e) => showModal('renaming', e.target)}>{t('channels.rename')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
            {!channel.removable && (
            <button
              type="button"
              id={channel.id}
              className={channel.id === channelIdActive ? 'w-100 text-start rounded-0 btn' : 'text-start w-100 rounded-0 btn'}
              onClick={() => setChannelActive(channel.id)}
            >
              <span className="me-1">#</span>
              {' '}
              { filterWords.clean(channel.name) }
            </button>
            )}
          </li>
        ))}
      </ul>
      {renderModal({
        modalInfo,
        hideModal,
      })}
    </div>
  );
}

export default Channels;
