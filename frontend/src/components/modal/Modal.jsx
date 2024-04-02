import React from 'react';
import { useSelector } from 'react-redux';
import getModal from './index.js';

const ModalComponent = () => {
  const { type, item } = useSelector((state) => state.modalsReducer);
  if (type === null) {
    return null;
  }
  const CurrentModal = getModal(type);
  return <CurrentModal item={item} />;
};
export default ModalComponent;
