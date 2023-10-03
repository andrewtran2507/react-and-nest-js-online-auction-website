import { createAsyncThunk } from '@reduxjs/toolkit';
import { MakeDeposit } from './type';
import * as depositsApi from 'services/api/deposit';

export const getDepositItem = createAsyncThunk(
  'deposit/item',
  async (id: string, thunkApi) => {
    try {
      const data = await depositsApi.getDepositItem(id);
      console.log('getAllData', data);
      return data.data;
    } catch (error: any) {
      // alert(error.response.data.message)
      return thunkApi.rejectWithValue(error.response.data);
    }
  }
);

export const createDeposit = createAsyncThunk(
  'deposit/create',
  async (depositData: MakeDeposit, thunkApi) => {
    try {
      const data = await depositsApi.createDeposit(depositData);
      console.log('makeDeposit', data);
      return data.data;
    } catch (e: any) {
      return thunkApi.rejectWithValue(e.response.data);
    }
  },
);
