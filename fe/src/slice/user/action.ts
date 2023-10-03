import { createAsyncThunk } from '@reduxjs/toolkit';
import * as userApi from 'services/api/users';
import { IPayloadLogin, UserRegister } from './types';

export const login = createAsyncThunk('auth/login', async (dataLogin: IPayloadLogin, thunkApi) => {
  try {
    const data = await userApi.login(dataLogin);
    console.log(data);
    if (data.data.token != null) {
      localStorage.setItem('accessToken', data.data.token);
    }
    return data.data;
  } catch (error: any) {
    // alert(error.response.data.message)
    return thunkApi.rejectWithValue(error.response.data);
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async (dataRegister: UserRegister, thunkApi) => {
    try {
      const data = await userApi.register(dataRegister);
      console.log(data);
      return data.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response.data);
    }
  },
);
