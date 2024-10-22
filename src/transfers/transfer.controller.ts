import { Controller, Get, Query, UseGuards, Post, Body } from '@nestjs/common';
import { TransfersService } from './transfer.service';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async initiateTransfer(
    @CurrentUser() user: UserEntity,
    @Body() createTransferDto: CreateTransferDto,
  ) {
    return this.transfersService.initiateTransfer(user, createTransferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTransferHistory(
    @CurrentUser() user: UserEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('filter') filter: string,
  ) {
    return this.transfersService.getUserTransferHistory(user, {
      page,
      limit,
      filter,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getFilteredTransferHistory(
    @CurrentUser() user: UserEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('filter') filter?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('amountFrom') amountFrom?: number,
    @Query('amountTo') amountTo?: number,
  ) {
    return this.transfersService.filterTransferHistory(user.id, {
      page,
      limit,
      filter,
      dateFrom,
      dateTo,
      amountFrom,
      amountTo,
    });
  }
}
