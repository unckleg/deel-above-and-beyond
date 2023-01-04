import { Expose, plainToClass } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ContractEntity } from '../../../infrastructure/database/mapper/ContractEntity';
import { Job } from '../../../domain/models/Job';

export class JobVM {
  @Expose()
  @ApiProperty({
    description: 'The id of the job',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The description of the job',
    example: 'Software Engineering Services - 2',
  })
  description: string;

  @Expose()
  @ApiProperty({
    description: 'The price for the job',
    example: 100,
  })
  price: number;

  @Expose()
  @ApiProperty({
    description: 'Payment status for the job',
    example: '',
  })
  paid: boolean;

  @Expose()
  @ApiProperty({ description: 'The payment date for job.' })
  paymentDate: Date;

  @Expose()
  @ApiProperty({
    description: 'The contractId',
  })
  ContractId: number;

  @Expose()
  @ApiProperty({
    description: 'The contract entity if present.',
  })
  contract?: ContractEntity;

  @Expose()
  @ApiProperty({ description: 'The creation date of the contract' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The date of the last contract update' })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ description: 'The deletion date of contract if deleted' })
  deletedAt: Date;

  static toViewModel(job: Job): JobVM {
    return plainToClass(JobVM, job, { excludeExtraneousValues: true });
  }
}
