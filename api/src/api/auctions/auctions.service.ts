import { HttpException, Injectable, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { maxBy } from 'lodash';
import { Auctions } from './entities/auction.entity';
import { Repository } from 'typeorm';
import { BidService } from '../bid/bid.service';


@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auctions)
    private auctionRepository: Repository<Auctions>,

    @Inject(forwardRef(() => BidService))
    private bidService: BidService,
  ) {}

  async create(createAuctionDto: CreateAuctionDto) {
    const newData = await this.auctionRepository.create(createAuctionDto);
    const res = await this.auctionRepository.save(newData);
    if (res) {
      return newData;
    }
    throw new HttpException('The auction cannot create', HttpStatus.CONFLICT);
  }

  async findAll() {
    const [items, count] = await this.auctionRepository.findAndCount({
      relations: { user: true, bids: true }
    });

    return {
      items: items.map(d => {
        const maxBidItem = maxBy(d.bids, 'price');
        d.bids = maxBidItem ? [{ ...maxBidItem }] : [];
        return d;
      }), count
    };
  }

  async findOne(id: string) {
    const item = await this.auctionRepository.findOneBy({ id });
    if (item) {
      return item;
    }
    throw new HttpException('The auction with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async findOneByData(data: {
    id: string,
    status: number
  }) {
    return await this.auctionRepository.findOneBy(data);
  }

  async update(id: string, updateAuctionDto: UpdateAuctionDto) {
    await this.auctionRepository.update(id, updateAuctionDto);
    const updateData = await this.auctionRepository.findOneBy({id});
    if (updateData) {
      return updateData
    }
    throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: string) {
    const item = await this.auctionRepository.findOneBy({id});
    if (!item) {
      throw new HttpException('Auction does not exist', HttpStatus.NOT_FOUND);
    }
    item.is_activated = false;
    delete item.id;
    const update = await this.auctionRepository.update(id, { ...item });
    if (!update.affected) {
      throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
    }
    return { ...item, id };
  }

  async handleUpdateAuctionsStatus() {
    // time window | min 5 mins
    const data = await this.auctionRepository.find({
      where: {
        status: 1, // ongoing
      }
    });
    if (data?.length > 0) {
      const dataWithTimeWindow = data.filter(item => {
        const newDate = (new Date()).getTime();
        const updatedAt = (new Date(item.updated_at)).getTime();
        console.log({
          newDate,
          updatedAt,
          range: newDate - updatedAt,
          time_window: item.time_window
        });
        return (newDate - updatedAt) >= item.time_window
      });
      console.log('dataWithTimeWindow', dataWithTimeWindow);
      await Promise.all(dataWithTimeWindow.map(item => this.auctionRepository.update(item.id, { ...item, status: 2 })));

      // Checking all Bid and change status and then refund
      const arrayAuction = dataWithTimeWindow.map(item => item.id);
      if (arrayAuction?.length > 0) {
        await this.bidService.handleUpdateBidStatus(arrayAuction)
      }
    }
  }
}
