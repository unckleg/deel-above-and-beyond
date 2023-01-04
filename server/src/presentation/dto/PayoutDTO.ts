import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PayoutDTO {
  @ApiProperty({ type: Number, example: 10 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
