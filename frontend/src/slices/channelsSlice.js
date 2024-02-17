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
      console.log(payload, 'payload v setChannelId');
      state.channelId = payload;
    },
    moveToChannel(state, { payload }) {
      console.log(payload, 'payload v movetoChannel');
      state.channelId = payload.id;
      console.log(state, 'state posle move');
    },
    addChannel(state, { payload }) {
      console.log(state.channels, 'do dobavlenia');
      state.channels.push(payload);
    },
    removeChannel(state, { payload }) {
      console.log(state.channels, 'do udalenia');
      const updateChannels = state.channels.filter((channel) => channel.id !== payload.id);
      state.channels = updateChannels;
      console.log(updateChannels, 'updatechannels');
      console.log(state.channels, 'posle');
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
