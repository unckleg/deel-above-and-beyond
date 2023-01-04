import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundError {
  @ApiProperty({
    description: 'The error status.',
    example: HttpStatus.NOT_FOUND,
  })
  code: HttpStatus;

  @ApiProperty({
    description: 'The error message.',
    example: 'The entity(Contract/Profile/Job) {12} has not be found.',
  })
  message: string;

  @ApiProperty({
    description: 'The time of the executed error.',
    example: new Date(),
  })
  timestamp: Date;

  @ApiProperty({
    description: 'The REST path called.',
    example: '/contracts/12',
  })
  path: string;
}
