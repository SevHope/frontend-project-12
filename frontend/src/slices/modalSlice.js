/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  item: null,
  isOpened: false,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    showModal: (state, { payload }) => {
      state.type = payload.type;
      state.item = payload.item;
      state.isOpened = true;
    },
    closeModal: (state) => {
      state.type = null;
      state.item = null;
    },
  },
});

export const { showModal, closeModal } = modalsSlice.actions;
export const { actions } = modalsSlice;
export default modalsSlice.reducer;
