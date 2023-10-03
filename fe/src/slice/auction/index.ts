import { createSlice } from '@reduxjs/toolkit';
import { getAllData, createAuction, updateAuction } from './action';
import { IAuctionState } from './types';

const initialState: IAuctionState = {
  loading: false,
  auctionList: null,
  auctionItem: null,
};
const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //#getAllData
      .addCase(getAllData.pending, (state: IAuctionState) => {
        state.loading = true;
      })
      .addCase(getAllData.fulfilled, (state: IAuctionState, action: any) => {
        state.loading = false;
        state.auctionList = { ...action.payload };
      })
      .addCase(getAllData.rejected, (state: IAuctionState, _) => {
        state.loading = false;
        state.auctionList = null;
      })

      //createAuction
      .addCase(createAuction.pending, (state: IAuctionState) => {
        state.loading = true;
      })
      .addCase(createAuction.fulfilled, (state: IAuctionState, action: any) => {
        state.loading = false;
        state.auctionItem = { ...action.payload };
        if (typeof state.auctionList?.count === 'number') {
          state.auctionList.count = state.auctionList.count + 1;
          state.auctionList.items = [{ ...action.payload }, ...state.auctionList.items];
        } else {
          state.auctionList = {
            items: [{ ...action.payload }],
            count: 1,
          };
        }
      })
      .addCase(createAuction.rejected, (state: IAuctionState, _) => {
        state.loading = false;
        state.auctionItem = null;
      })

      //updateAuction
      .addCase(updateAuction.pending, (state: IAuctionState) => {
        state.loading = true;
      })
      .addCase(updateAuction.fulfilled, (state: IAuctionState, action: any) => {
        state.loading = false;
        state.auctionItem = { ...action.payload };
        const indx = state.auctionList?.items.findIndex((d) => d.id === action?.payload?.id);
        if (typeof indx === 'number' && indx >= 0 && state.auctionList) {
          state.auctionList.items[indx] = { ...action.payload };
        }
      })
      .addCase(updateAuction.rejected, (state: IAuctionState, _) => {
        state.loading = false;
        state.auctionItem = null;
      })
  },
});

export const { reducer: auctionReducer } = auctionSlice;
export const { } = auctionSlice.actions;
