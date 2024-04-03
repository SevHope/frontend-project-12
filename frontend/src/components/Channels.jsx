import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import filterWords from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../slices/channelsSlice';
import PlusIcon from '../images/Plus';
import { actions as modalActions } from '../slices/modalSlice';
import ModalComponent from './modal/Modal';

const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector((state) => state.channelsReducer);
  const channelIdActive = useSelector((state) => state.channelsReducer.channelId);
  const setShowModal = (type, item = null) => dispatch(modalActions.showModal({ type, item }));

  return (
    <>
      <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
          <span className="bold-text">{t('channels.channels')}</span>
          <button
            type="button"
            className="p-0 text-primary btn btn-group-vertical"
            onClick={() => setShowModal('adding')}
          >
            <PlusIcon />
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
                    className={channel.id === channelIdActive ? 'w-100 rounded-0 text-start text-truncate btn btn-secondary' : 'w-100 text-truncate rounded-0 text-start btn'}
                    onClick={() => dispatch(channelsActions.moveToChannel(channel.id))}
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
                      <Dropdown.Item id={channel.id} onClick={(e) => setShowModal('removing', e.target.id)}>
                        {t('channels.delete')}
                      </Dropdown.Item>
                      <Dropdown.Item id={channel.id} name={channel.name} onClick={(e) => setShowModal('renaming', e.target)}>{t('channels.rename')}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
              {!channel.removable && (
              <button
                type="button"
                id={channel.id}
                className={channel.id === channelIdActive ? 'w-100 text-start rounded-0 btn btn-secondary' : 'text-start w-100 rounded-0 btn'}
                onClick={() => dispatch(channelsActions.moveToChannel(channel.id))}
              >
                <span className="me-1">#</span>
                {' '}
                { filterWords.clean(channel.name) }
              </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <ModalComponent />
    </>
  );
};

export default Channels;
