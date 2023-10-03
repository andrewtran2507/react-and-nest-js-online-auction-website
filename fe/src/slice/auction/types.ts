export interface IPayloadAuction {
  user_id: string;
  name: string;
  started_price: number;
  time_window: number;
}

export interface UPayloadAuction {
  id: string;
  user_id: string;
  name: string;
  started_price: number;
  time_window: number;
  status?: number;
}

export interface ItemAuction {
  id: string;
  user_id: string;
  name: string;
  started_price: number;
  time_window: number;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  is_activated: boolean;
  user: any;
  bids: any;
}

export interface IAuctionState {
  loading: boolean;
  auctionList: {
    count: number;
    items: ItemAuction[];
  } | null;
  auctionItem: ItemAuction | null;
}
