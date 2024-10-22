import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  recipientUsername: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}
