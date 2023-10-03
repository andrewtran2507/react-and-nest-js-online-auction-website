import { MakeDeposit } from 'slice/deposit/type';
import axios from '../axios';

const CONTROLLER_NAME = '/deposit';

export const getDepositItem = (id: string) => {
  return axios.get(`${CONTROLLER_NAME}/user/${id}`);
};

export const createDeposit = (dataItem: MakeDeposit) => {
  return axios.post(`${CONTROLLER_NAME}`, dataItem);
};
