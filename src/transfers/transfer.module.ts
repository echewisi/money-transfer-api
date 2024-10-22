import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfersController } from './transfer.controller';
import { TransfersService } from './transfer.service';
import { TransfersRepository } from './transfer.repository';
import { TransferEntity } from './entities/transfer.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransferEntity]), UsersModule],
  controllers: [TransfersController],
  providers: [TransfersService, TransfersRepository],
})
export class TransfersModule {}
