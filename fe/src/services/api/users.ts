import { IPayloadLogin, UserRegister } from "slice/user/types";
import axios from "../axios";

const CONTROLLER_NAME = "/authentication"

export const login = (dataLogin:IPayloadLogin) => {
    return axios.post(`${CONTROLLER_NAME}/sign-in`, dataLogin)
}

export const register = (dataRegister:UserRegister) => {
    return axios.post(`${CONTROLLER_NAME}/sign-up`, dataRegister)
}

// export const getProductList = (params: any) => {
//     return axios.get(`/product?offset=${params.offset}&limit=${params.limit}`, params)
// }

// export const filterProductList = (filterPayload: any) => {
//     return axios.post(`/product/filter-data`, filterPayload)
// }
// export const getProductColor = () => {
//     return axios.get(`/product-color`)
// }
// export const getCategoryList = () => {
//     return axios.get(`/category`)
// }
// export const getBrandList= () => {
//     return axios.get(`/branch`)
// }
// export const placeOrder = (orderPayload: any) => {
//     return axios.post(`/order`, orderPayload)
// }
// export const orderDetailsByUser = () => {
//     return axios.post(`/order-details/by-user`)
// }
// export const orderDetailsUpdateStatus = (payload: any) => {
//     return axios.post(`/order-details/update-status`, payload)
// }
