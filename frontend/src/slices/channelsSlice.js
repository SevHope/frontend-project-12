/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const defaultChannelId = '1';

const initialState = {
  channels: [],
  channelId: defaultChannelId,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, { payload }) => {
      state.channels = payload;
      console.log(state, 'state v channelSlice');
    },
    setChannelId(state, { payload }) {
      state.channelId = payload;
    },
    moveToChannel(state, { payload }) {
      console.log(payload, 'payload v movetoChannel');
      state.channelId = payload.id;
      console.log(state, 'state posle move');
    },
    addChannel(state, { payload }) {
      state.channels.push(payload);
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
