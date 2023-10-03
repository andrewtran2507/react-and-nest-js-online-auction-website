import { createAsyncThunk } from '@reduxjs/toolkit';
import * as bidApi from 'services/api/bid';
import { IPayloadBid } from './type';

export const createBid = createAsyncThunk('bid/create', async (dataItem: IPayloadBid, thunkApi) => {
  try {
    const data = await bidApi.createBid(dataItem);
    console.log('dataBidItem', data);
    return data.data;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error.response.data);
  }
});
