import { User } from '../../user/entities/user.entity';
import { Auctions } from '../../auctions/entities/auction.entity';
import { Bid } from '../../bid/entities/bid.entity';
import { Deposit } from '../../deposit/entities/deposit.entity';

const mockedUser: User = {
  id: 'adasdad123213123adasd',
  email: 'user@email.com',
  name: 'John',
  password: 'hash',
  auctions: [],
  bids: [],
  deposit: new Deposit,
  created_at: undefined,
  updated_at: undefined,
  deleted_at: undefined,
  is_activated: false
};

export default mockedUser;
