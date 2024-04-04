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
    },
    moveToChannel(state, { payload }) {
      state.channelId = payload;
    },
    addChannel(state, { payload }) {
      state.channels.push(payload);
    },
    removeChannel(state, { payload }) {
      state.channelId = state.channelId === payload.id ? defaultChannelId : state.channelId;
      const updateChannels = state.channels.filter((channel) => channel.id !== payload.id);
      state.channels = updateChannels;
    },
    renameChannel(state, { payload }) {
      const renamedChannel = state.channels.find((channel) => channel.id === payload.id);
      renamedChannel.name = payload.name;
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
