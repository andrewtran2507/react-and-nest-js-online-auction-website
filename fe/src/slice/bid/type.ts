export interface CreateItemType {
  name: string;
  started_price: number;
  time_window: number;
  user_id: string;
  status: string;
  published_at: Date | string | null;
}

export interface ItemState {
  loading: boolean;
  bidList: any[];
  bidInfo: any;
}

export interface PublishItemType {
  id: string;
  user_id: string;
  status: string;
  published_at: string;
}

export interface BidItemType {
  id: string;
  user_id: string;
  price: number;
}

export interface IPayloadBid {
  user_id: string;
  auction_id: string;
  price: number;
}

export interface IBid {
  user_id: string;
  auction_id: string;
  price: 100;
  deleted_at?: null | string;
  id: string;
  status: 0;
  created_at: string;
  updated_at: string;
  is_activated: boolean;
}
