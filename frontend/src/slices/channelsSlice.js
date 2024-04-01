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
      state.channelId = payload;
    },
    addChannel(state, { payload }) {
      state.channels.push(payload);
    },
    removeChannel(state, { payload }) {
      const updateChannels = state.channels.filter((channel) => channel.id !== payload.id);
      state.channels = updateChannels;
    },
    renameChannel(state, { payload }) {
      const renamedChannel = state.channels.find((channel) => channel.id === payload.id);
      renamedChannel.name = payload.name;
    },
    getState(state) {
      return state.channels;
    },
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
