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
    setChannelId(state, { payload }) {
      state.channelId = payload;
    },
    moveToChannel(state, { payload }) {
      state.channelId = payload.id;
    },
    addChannel(state, { payload }) {
      const { username } = JSON.parse(localStorage.getItem('userInfo'));
      if (payload.author === username) {
        state.channelId = payload.id;
      }
      state.channels.push(payload);
    },
    removeChannel(state, { payload }) {
      const updateChannels = state.channels.filter((channel) => channel.id !== payload.id);
      if (state.channelId === payload.id) {
        state.channelId = defaultChannelId;
      }
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
