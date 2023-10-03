import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { Auctions } from './entities/auction.entity';
import { UserModule } from '../user/user.module';
import { BidModule } from '../bid/bid.module';

@Module({
  imports: [UserModule, forwardRef(() => BidModule), TypeOrmModule.forFeature([Auctions])],
  controllers: [AuctionsController],
  providers: [AuctionsService],
  exports: [AuctionsService]
})
export class AuctionsModule {}
