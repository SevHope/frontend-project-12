/* eslint-disable */

import React from 'react';
import { useSelector } from 'react-redux';

const Channels = () => {
  const { channels } = useSelector((state) => state.channelsReducer);
  console.log(channels);

  return (
    <div className="mt-3">
      channels
    </div>
  );
};

export default Channels;
