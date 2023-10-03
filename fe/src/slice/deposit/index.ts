import { createSlice } from '@reduxjs/toolkit';
import { DepositState } from './type';
import { getDepositItem, createDeposit } from './action';

const initialState: DepositState = {
  loading: false,
  depositInfo: {},
};

const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //createDeposit
      .addCase(createDeposit.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(createDeposit.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.depositInfo = { ...action.payload };
      })
      .addCase(createDeposit.rejected, (state: any, _action: any) => {
        state.loading = false;
      })

      //getDepositItem
      .addCase(getDepositItem.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(getDepositItem.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.depositInfo = { ...action.payload };
      })
      .addCase(getDepositItem.rejected, (state: any, _action: any) => {
        state.loading = false;
      })
      ;
  },
});

export const { reducer: depositReducer } = depositSlice;
export const {} = depositSlice.actions;
