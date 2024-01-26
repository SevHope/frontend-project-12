/* eslint-disable */
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messagesAdapter.addMany,
  },
});

export const selectors = messagesAdapter.getSelectors((state) => state.messagesReducer);

export const { actions, reducer } = messagesSlice;
export default reducer;
