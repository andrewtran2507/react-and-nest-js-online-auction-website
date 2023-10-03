import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { AuctionsService } from '../auctions/auctions.service';


@Injectable()
export class ScheduleService {
  constructor(
    private readonly auctionsService: AuctionsService
  ) {}

  private readonly logger = new Logger(ScheduleService.name);

  @Cron('*/2 * * * *')
  async handleUpdateAuctionStatus() {
    this.logger.debug('Calling handleUpdateAuctionStatus every 2 minutes');
    await this.auctionsService.handleUpdateAuctionsStatus();
  }

}
