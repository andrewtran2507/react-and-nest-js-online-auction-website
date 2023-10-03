import { createAsyncThunk } from '@reduxjs/toolkit';
import * as auctionApi from 'services/api/auction';
import { IPayloadAuction, UPayloadAuction } from './types';

export const getAllData = createAsyncThunk('auction/list', async (_, thunkApi) => {
  try {
    const data = await auctionApi.getAllData();
    console.log('getAllData', data);
    return data.data;
  } catch (error: any) {
    // alert(error.response.data.message)
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const createAuction = createAsyncThunk(
  'auction/create',
  async (payload: IPayloadAuction, thunkApi) => {
    try {
      const data = await auctionApi.createAuction(payload);
      console.log('createAuction', data);
      return data.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);


export const updateAuction = createAsyncThunk(
  'auction/update',
  async (payload: UPayloadAuction, thunkApi) => {
    try {
      const data = await auctionApi.updateAuction(payload.id, payload);
      console.log('updateAuction', data);
      return data.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);