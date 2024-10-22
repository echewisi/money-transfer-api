import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findByUsername(
      createUserDto.username,
    );

    if (existingUser) {
      throw new BadRequestException('Username is already taken');
    }

    return this.usersRepository.createUser(createUserDto);
  }

  async getUserById(id: string): Promise<UserEntity> {
    const cacheKey = `user_${id}`;

    // Check Redis cache first
    const cachedUser = await this.redisClient.get(cacheKey);
    if (cachedUser) {
      return JSON.parse(cachedUser); // Return cached user object directly
    }

    // If not cached, query the database
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cache the user object in Redis for 1 hour
    await this.redisClient.set(cacheKey, JSON.stringify(user), 'EX', 3600);
    return user;
  }

  async updateUserBalance(userId: string, newBalance: number): Promise<void> {
    // Update balance in DB
    await this.usersRepository.updateBalance(userId, newBalance);

    const cacheKey = `user_${userId}`;

    // Update cache in Redis
    const cachedUser = await this.redisClient.get(cacheKey);
    if (cachedUser) {
      const user = JSON.parse(cachedUser);
      user.balance = newBalance; // Update balance in cached user object
      await this.redisClient.set(cacheKey, JSON.stringify(user), 'EX', 3600); // Update cached value
    }
  }

  async clearCacheForUser(userId: string): Promise<void> {
    const cacheKey = `user_${userId}`;
    await this.redisClient.del(cacheKey); // Remove cache for the specific user
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.usersRepository.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
