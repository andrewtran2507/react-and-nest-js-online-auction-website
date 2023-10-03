import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { AlertModule } from './alter/alert.module';
import { BidModule } from './bid/bid.module';
import { DepositModule } from './deposit/deposit.module';
import { AuctionsModule } from './auctions/auctions.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    RoleModule,
    AlertModule,
    BidModule,
    DepositModule,
    AuctionsModule,
    ScheduleModule
  ],
})
export class ApiModule {}
