import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from './entities/deposit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepositService {
  constructor(
    @InjectRepository(Deposit)
    private depositRepository: Repository<Deposit>,
  ) {}

  async create(createDepositDto: CreateDepositDto) {
    const item = await this.depositRepository.findOneBy({ user_id: createDepositDto.user_id });
    if (item?.id) {
      return this.update(item?.id, {...item, ...createDepositDto});
    }
    const newData = await this.depositRepository.create(createDepositDto);
    const res = await this.depositRepository.save(newData);
    if (res) {
      return newData;
    }
    throw new HttpException('The deposit cannot create', HttpStatus.CONFLICT);
  }

  async findAll() {
    const [items, count] = await this.depositRepository.findAndCount({
      relations: { user: true }
    });
    return {
      items, count
    };
  }

  async findOne(id: string) {
    const item = await this.depositRepository.findOneBy({ id });
    if (item) {
      return item;
    }
    throw new HttpException('The deposit with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateDepositDto: UpdateDepositDto) {
    await this.depositRepository.update(id, updateDepositDto);
    const updateData = await this.depositRepository.findOneBy({id});
    if (updateData) {
      return updateData
    }
    throw new HttpException('Deposit not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: string) {
    const item = await this.depositRepository.findOneBy({id});
    if (!item) {
      throw new HttpException('Deposit does not exist', HttpStatus.NOT_FOUND);
    }
    item.is_activated = false;
    delete item.id;
    const update = await this.depositRepository.update(id, { ...item });
    if (!update.affected) {
      throw new HttpException('Deposit not found', HttpStatus.NOT_FOUND);
    }
    return { ...item, id };
  }

  async findOneByData(data: {
    user_id: string
  }) {
    console.log(' into here ')
    return await this.depositRepository.findOneBy(data);
  }

}
