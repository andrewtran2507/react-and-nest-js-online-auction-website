export interface MakeDeposit {
  user_id: string;
  amount: number;
}

export interface DepositState {
  loading: boolean;
  depositInfo: {};
}
