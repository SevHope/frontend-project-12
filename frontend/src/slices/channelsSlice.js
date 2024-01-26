/* eslint-disable */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

// BEGIN (write your solution here)
const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannel: channelsAdapter.addOne,
  },
});

export const selectors = channelsAdapter.getSelectors((state) => state.channelsReducer);

export const { actions, reducer } = channelsSlice;
export default reducer;
