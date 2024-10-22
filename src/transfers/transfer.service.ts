import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransfersRepository } from './transfer.repository';
import { UsersService } from '../users/users.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UserEntity } from '../users/entities/user.entity';
import { TransferEntity } from './entities/transfer.entity';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(TransfersRepository)
    private readonly transfersRepository: TransfersRepository,
    private readonly usersService: UsersService,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async initiateTransfer(
    sender: UserEntity,
    createTransferDto: CreateTransferDto,
  ) {
    const { recipientUsername, amount } = createTransferDto;

    // Check if sender has enough balance
    if (sender.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Fetch the recipient user by username
    const recipient =
      await this.usersService.getUserByUsername(recipientUsername);

    if (!recipient) {
      throw new BadRequestException('Recipient not found');
    }

    // Call the repository method to handle the transaction using QueryRunner
    try {
      const transfer = await this.transfersRepository.createTransferRecord(
        sender,
        recipient,
        amount,
      );
      return transfer;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Transfer failed');
    }
  }

  async filterTransferHistory(
    userId: string,
    {
      page,
      limit,
      filter,
      dateFrom,
      dateTo,
      amountFrom,
      amountTo,
    }: {
      page: number;
      limit: number;
      filter?: string;
      dateFrom?: string;
      dateTo?: string;
      amountFrom?: number;
      amountTo?: number;
    },
  ) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();

      // Base query for transfer history
      let query = queryRunner.manager
        .createQueryBuilder(TransferEntity, 'transfer')
        .where(
          'transfer.senderId = :userId OR transfer.recipientId = :userId',
          {
            userId,
          },
        )
        .orderBy('transfer.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit);

      // Apply filters
      if (filter) {
        query = query.andWhere('transfer.amount = :filter', { filter });
      }
      if (dateFrom && dateTo) {
        query = query.andWhere(
          'transfer.createdAt BETWEEN :dateFrom AND :dateTo',
          {
            dateFrom,
            dateTo,
          },
        );
      }
      if (amountFrom && amountTo) {
        query = query.andWhere(
          'transfer.amount BETWEEN :amountFrom AND :amountTo',
          {
            amountFrom,
            amountTo,
          },
        );
      }

      // Execute the query
      const [transfers, count] = await query.getManyAndCount();

      return { transfers, count };
    } catch (error) {
      console.log('Error fetching transfer history:', error);
      throw new InternalServerErrorException(
        'Could not retrieve transfer history',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getUserTransferHistory(
    user: UserEntity,
    options: { page: number; limit: number; filter?: string },
  ) {
    return this.transfersRepository.findTransferHistory(user.id, options);
  }
}
