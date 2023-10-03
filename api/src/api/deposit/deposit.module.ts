import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { UserModule } from '../user/user.module';
import { Deposit } from './entities/deposit.entity'

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Deposit])],
  controllers: [DepositController],
  providers: [DepositService],
  exports: [DepositService]
})
export class DepositModule {}
