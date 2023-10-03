import { IPayloadAuction } from "slice/auction/types";
import axios from "../axios";

const CONTROLLER_NAME = "/auctions"

export const getAllData = () => {
  return axios.get(`${CONTROLLER_NAME}`)
}

export const createAuction = (payload: IPayloadAuction) => {
  return axios.post(`${CONTROLLER_NAME}`, payload)
}

export const updateAuction = (id: string, payload: IPayloadAuction) => {
  return axios.patch(`${CONTROLLER_NAME}/${id}`, payload)
}
