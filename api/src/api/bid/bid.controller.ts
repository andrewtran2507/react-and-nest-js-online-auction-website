import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Body() createBidDto: CreateBidDto) {
    return this.bidService.create(createBidDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  findAll() {
    return this.bidService.findAll();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bidService.findOne(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBidDto: UpdateBidDto) {
    return this.bidService.update(id, updateBidDto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bidService.remove(id);
  }

  // @UseGuards(JwtAuthenticationGuard)
  // @Get('handle/status')
  // async handleBidStatus(@Req() request: RequestWithUser) {
  //   return await this.bidService.handleUpdateBidStatus(['441280c5-6a2a-4fa9-9fa1-9146b12f011f', 'f262e7cd-ae06-40a9-b3ca-25647f6bc3e0']);
  // }
}
