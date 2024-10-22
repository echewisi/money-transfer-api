import { Injectable, Inject } from '@nestjs/common';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { TransferEntity } from './entities/transfer.entity';
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransfersRepository {
  constructor(
    @InjectRepository(TransferEntity)
    private readonly transferRepo: Repository<TransferEntity>,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async createTransferRecord(
    sender_id: UserEntity,
    recipient: UserEntity,
    amount: number,
  ) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    // Start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get sender and receiver details
      const sender = await queryRunner.manager.findOne(UserEntity, {
        where: { id: sender_id.id },
      });
      const receiver = await queryRunner.manager.findOne(UserEntity, {
        where: { id: recipient.id },
      });

      // Update balances
      sender.balance -= amount;
      receiver.balance += amount;

      await queryRunner.manager.save(sender);
      await queryRunner.manager.save(receiver);

      // Log the transfer in transfer table
      const transfer = new TransferEntity();
      transfer.senderId = sender.id;
      transfer.id = receiver.id;
      transfer.amount = amount;

      await queryRunner.manager.save(TransferEntity, transfer);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new Error('Transfer failed');
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async findTransferHistory(
    userId: string,
    { page, limit, filter }: { page: number; limit: number; filter?: string },
  ) {
    const query = this.transferRepo
      .createQueryBuilder('transfer')
      .where('transfer.senderId = :userId OR transfer.recipientId = :userId', {
        userId,
      })
      .orderBy('transfer.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (filter) {
      query.andWhere('transfer.amount = :filter', { filter });
    }

    return await query.getManyAndCount();
  }
}
