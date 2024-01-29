/* eslint-disable no-trailing-spaces */
import React from 'react';
import { useSelector } from 'react-redux';

function Channels() {
  const channels = useSelector((state) => state.channelsReducer) || [];
  console.log(channels.channels, 'channels v Channels');

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <span className="bold-text">
          {' '}
          {channels.channels.map((channel) => (
            <div key={channel.id}>
              #
              {' '}
              {channel.name}
            </div>
          ))}
        </span>
      </div>
    </div>
  );
}

export default Channels;
