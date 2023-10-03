import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { AuctionsModule } from '../auctions/auctions.module';

@Module({
  imports: [AuctionsModule],
  providers: [ScheduleService],
  exports: [ScheduleService]
})
export class ScheduleModule {}
