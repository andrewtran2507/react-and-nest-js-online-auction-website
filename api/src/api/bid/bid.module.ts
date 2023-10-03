import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { Bid } from './entities/bid.entity';
import { UserModule } from '../user/user.module';
import { AuctionsModule } from '../auctions/auctions.module';
import { DepositModule } from '../deposit/deposit.module';

@Module({
  imports: [UserModule, forwardRef(() => AuctionsModule), forwardRef(() => DepositModule), TypeOrmModule.forFeature([Bid])],
  controllers: [BidController],
  providers: [BidService],
  exports: [BidService]
})
export class BidModule {}
