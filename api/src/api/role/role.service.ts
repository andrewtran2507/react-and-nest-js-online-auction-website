import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const newData = await this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(newData);
    return newData;
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(id: string) {
    const item = await this.roleRepository.findOneBy({ id });
    if (item) {
      return item;
    }
    throw new HttpException('Role with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, UpdateRoleDto);
    const updateData = await this.roleRepository.findOneBy({id});
    if (updateData) {
      return updateData
    }
    throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: string) {
    const item = await this.roleRepository.findOneBy({id});
    if (!item) {
      throw new HttpException('Role does not exist', HttpStatus.NOT_FOUND);
    }
    item.is_activated = false;
    delete item.id;
    const update = await this.roleRepository.update(id, { ...item });
    if (!update.affected) {
      throw new HttpException('Role not found', HttpStatus.NOT_FOUND);
    }
    return { ...item, id };
  }
}
