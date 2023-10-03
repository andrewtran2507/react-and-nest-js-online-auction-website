import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Body() createDepositDto: CreateDepositDto) {
    return this.depositService.create(createDepositDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  findAll() {
    return this.depositService.findAll();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depositService.findOne(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('user/:id')
  async findByUserId(@Param('id') id: string) {
    return await this.depositService.findOneByData({user_id: id});
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDepositDto: UpdateDepositDto) {
    return this.depositService.update(id, updateDepositDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depositService.remove(id);
  }
}
