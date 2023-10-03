import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.usersRepository.find();
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      relations: { auctions: true, bids: true },
      where: { id },
    });
    if (user) {
      delete user.password;
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async update(id: string, userData: UpdateUserDto) {
    await this.usersRepository.update(id, userData);
    const updateUserData = await this.usersRepository.findOneBy({id});
    if (updateUserData) {
      return updateUserData
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneBy({id});
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    user.is_activated = false;
    delete user.id;
    const update = await this.usersRepository.update(id, { ...user });
    if (!update.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return { ...user, id };
  }

  async setCurrentRefreshToken(token: string, refreshToken: string, userId: string) {
    // const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      token,
      refreshToken
    });
  }

  async getUserIfRefreshTokenMatches(token: string, userId: string) {
    const user = await this.findOne(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      token,
      user.token,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
    return null;
  }

  async removeRefreshToken(userId: string) {
    return this.usersRepository.update(userId, {
      token: null,
      refreshToken: null,
    });
  }
}
