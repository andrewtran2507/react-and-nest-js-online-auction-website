import { createSlice } from '@reduxjs/toolkit';
import { login, register } from './action';
import { IUserState } from './types';

const initialState: IUserState = {
  loading: false,
  userInfo: {},
  accessToken: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state: IUserState, action) => {
      state.accessToken = action.payload.accessToken;
    },
    logout: (state: IUserState) => {
      state.accessToken = '';
      state.userInfo = {};
    },
    // setNotificationAlert: (state: IUserState, action) => {
    //   state.notificationAlert = action.payload;
    // }
  },
  extraReducers: (builder) => {
    builder
      //#region login
      .addCase(login.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.accessToken = action.payload.token;
        state.userInfo = {
          name: action.payload.name,
          email: action.payload.email,
          id: action.payload.id,
          ...action.payload,
        };
      })
      .addCase(login.rejected, (state: any, action: any) => {
        state.loading = false;
        state.accessToken = null;
      })
      //register
      .addCase(register.pending, (state: any) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.userInfo = {
          name: action.payload.name,
          email: action.payload.email,
          ...action.payload,
        };
      })
      .addCase(register.rejected, (state: any, _action: any) => {
        state.loading = false;
      });
  },
});

export const { reducer: userReducer } = userSlice;

/// setNotificationAlert
export const { setAccessToken, logout } = userSlice.actions;
