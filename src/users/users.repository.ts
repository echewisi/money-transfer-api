import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { username } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  async updateBalance(userId: string, newBalance: number): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set({ balance: newBalance })
      .where('id = :userId', { userId })
      .execute();
  }
}
