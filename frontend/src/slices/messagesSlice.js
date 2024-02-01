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
    addMessage: (state, { payload: { message } }) => {
      state.messages = [message, ...state.messages];
    },
  },
});

export const { actions } = messagesSlice;
export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
