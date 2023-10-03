export type ItemType = {
  id: string;
  name: string;
  current_price?: number;
  started_price: number;
  status: string; //draft, publish, complete
  duration?: string;
  published_at: string | null;
  time_window: number; //seconds
  user_id: string;
  created_at: string;
  updated_at: string;
  is_owner?: boolean | null | undefined;
  bids?: any; 
};
