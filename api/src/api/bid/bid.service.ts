import { HttpException, Injectable, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { groupBy } from 'lodash';
import { Bid } from './entities/bid.entity';
import { AuctionsService } from '../auctions/auctions.service';
import { DepositService } from '../deposit/deposit.service';

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,

    @Inject(forwardRef(() => AuctionsService))
    private auctionsService: AuctionsService,

    @Inject(forwardRef(() => DepositService))
    private depositService: DepositService,
  ) {}

  async create(createBidDto: CreateBidDto) {
    // checking an auction in ongoing status & bid's price more than started_price
    const auctionItem = await this.auctionsService.findOneByData({
      id: createBidDto.auction_id,
      status: 1
    });

    // find a bid from auction id
    const bidItem = await this.bidRepository.find({
      skip:0,
      take:1,
      order: { created_at: "DESC" },
      where: {
        // user_id: createBidDto.user_id,
        auction_id: createBidDto.auction_id,
      }
    });

    // check user have enough amount
    const dpItem = await this.depositService.findOneByData({user_id: createBidDto.user_id});
    const exChangeM = ((dpItem?.amount || 0) - createBidDto.price);

    if (
      exChangeM > 0 &&
      (auctionItem?.id && auctionItem?.started_price < createBidDto.price) &&
      (
        (
          (bidItem[0]?.id && (((new Date()).getTime() - (new Date(bidItem[0]?.created_at)).getTime()) / 1000) > 5) && // more 5 secs accept for adding a new bid
          bidItem[0]?.price < createBidDto.price // current bid's price need more than previous bid's price
        ) ||
        !bidItem[0]
      )
    ) {
      // check created_at to accept insert
      const newData = await this.bidRepository.create(createBidDto);
      const res = await this.bidRepository.save(newData);
      if (res) {
        // update user amount
        dpItem.amount = exChangeM;
        await this.depositService.update(dpItem.id, dpItem);
        return newData;
      }
    }
    throw new HttpException('The bid cannot create', HttpStatus.CONFLICT);
  }

  async findAll() {
    const [items, count] = await this.bidRepository.findAndCount({
      relations: { user: true }
    });
    return {
      items, count
    };
  }

  async findOne(id: string) {
    const item = await this.bidRepository.findOneBy({ id });
    if (item) {
      return item;
    }
    throw new HttpException('The bid with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateBidDto: UpdateBidDto) {
    await this.bidRepository.update(id, updateBidDto);
    const updateData = await this.bidRepository.findOneBy({id});
    if (updateData) {
      return updateData
    }
    throw new HttpException('Bid not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: string) {
    const item = await this.bidRepository.findOneBy({id});
    if (!item) {
      throw new HttpException('Bid does not exist', HttpStatus.NOT_FOUND);
    }
    item.is_activated = false;
    delete item.id;
    const update = await this.bidRepository.update(id, { ...item });
    if (!update.affected) {
      throw new HttpException('Bid not found', HttpStatus.NOT_FOUND);
    }
    return { ...item, id };
  }

  async handleUpdateBidStatus(arr: string[]) {
    const data = [];
    for (const auctionId of arr) {
      console.log(auctionId);
      /// get the bid biggest
      const bidBiggest = await this.bidRepository
      .createQueryBuilder('bid')
      .where(
        getSqlMaxPriceWithOP('='),
        { auctionId }
      )
      .andWhere("bid.status = :status", { status: 0 })
      .getOne();
      /// Update this bid to win
      if (bidBiggest?.id) {
        /// Update bid's user to win
        bidBiggest.status = 1;
        await this.update(bidBiggest.id, bidBiggest);
        console.log(`USER ${ bidBiggest.user_id } WITH BID ${bidBiggest.id} IS WIN`);

        /// get all bid's another user less than bid's biggest
        let bidLessThanBiggest = await this.bidRepository
        .createQueryBuilder('bid')
        .where(
          getSqlMaxPriceWithOP('<'),
          { auctionId }
        )
        .andWhere("bid.status = :status", { status: 0 })
        .andWhere("bid.user_id != :userId", { userId: bidBiggest.user_id })
        .getMany();

        /// Refund money to user not win bid on auction
        if (bidLessThanBiggest.length > 0) {
          bidLessThanBiggest = groupBy(bidLessThanBiggest, 'user_id');
          for (const bKey in bidLessThanBiggest) {

            let refund = 0;
            for (const item of bidLessThanBiggest[bKey] as any) {
              refund = refund + item.price;
            }
            if (refund > 0) {
              console.log(`REFUNd USER ${ bKey } is ${refund}$`);
              const dpItem = await this.depositService.findOneByData({user_id: bKey});
              if (dpItem?.id) {
                dpItem.amount = dpItem.amount + refund;
                await this.depositService.update(dpItem.id, dpItem);
              }
            }
          }
        }
        data.push({bidBiggest, bidLessThanBiggest});
      }
    }
    return {data};
  }
}

const getSqlMaxPriceWithOP = (op: string) => `
(
  select MAX(a.price)
  from (
    select *
    from bid b
    where
      b.auction_id = :auctionId
    and
      b.status = 0
  ) a
) ${op} bid.price
`
