import { combineReducers } from "redux";
import { userReducer } from "slice/user";
import { auctionReducer } from "slice/auction";
import { bidReducer } from "slice/bid";
import { depositReducer } from "slice/deposit";

export default combineReducers({
  user: userReducer,
  auction: auctionReducer,
  bid: bidReducer,
  deposit: depositReducer,
});
