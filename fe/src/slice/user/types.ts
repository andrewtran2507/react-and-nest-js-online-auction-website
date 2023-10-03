export interface IUserState {
  loading: boolean,
  userInfo: any,
  accessToken: string,
}
export interface IPayloadLogin {
  email: string;
  password: string;
}

export interface UserRegister{
  email: string;
  password:string;
}
