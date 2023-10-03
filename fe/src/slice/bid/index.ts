import { createSlice } from '@reduxjs/toolkit';
import { ItemState } from './type';
import { createBid } from './action';

const initialState: ItemState = {
  loading: false,
  bidList: [],
  bidInfo: {},
};

const bidSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //createItem
      .addCase(createBid.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(createBid.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.bidList = [{ ...action.payload }, ...state.bidList];
        state.bidInfo = { ...action.payload };
      })
      .addCase(createBid.rejected, (state: any, _action: any) => {
        state.loading = false;
      });
  },
});

export const { reducer: bidReducer } = bidSlice;

export const {} = bidSlice.actions;
