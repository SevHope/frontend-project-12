/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, { payload }) => {
      state.messages = payload;
    },
    addMessage: (state, { payload }) => {
      console.log(payload, 'payload v addMessage');
      state.messages.push(payload);
    },
  },
});

export const { actions } = messagesSlice;
export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
