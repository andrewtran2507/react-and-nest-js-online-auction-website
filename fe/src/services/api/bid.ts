import { IPayloadBid } from "slice/bid/type";
import axios from "../axios";

const CONTROLLER_NAME = "/bid"

export const createBid = (dataItem: IPayloadBid) => {
    return axios.post(`${CONTROLLER_NAME}`, dataItem)
}
