import { Expose, plainToClass } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Contract } from '../../../domain/models/Contract';
import { ProfileEntity } from '../../../infrastructure/database/mapper/ProfileEntity';
import { JobEntity } from '../../../infrastructure/database/mapper/JobEntity';

export class ContractVM {
  @Expose()
  @ApiProperty({
    description: 'The id of the contract',
    example: 1,
  })
  id: number;

  @Expose()
  @ApiProperty({
    description: 'The terms of the contract',
    example: 'Domain Driven Design',
  })
  terms: string;

  @Expose()
  @ApiProperty({
    description: 'The status of the contract',
    example: "['new', 'in_progress', 'terminated']",
  })
  status: string;

  @Expose()
  @ApiProperty({
    description: 'The contractorId',
  })
  ContractorId: number;

  @Expose()
  @ApiProperty({
    description: 'The contractor entity',
    type: ProfileEntity,
  })
  contractor: ProfileEntity;

  @Expose()
  @ApiProperty({
    description: 'The clientId',
    example: 7,
  })
  ClientId: number;

  @Expose()
  @ApiProperty({
    description: 'The client entity',
    type: ProfileEntity,
  })
  client: ProfileEntity;

  @Expose()
  @ApiProperty({
    description: 'The list of all jobs related to contract',
    type: JobEntity,
    isArray: true,
  })
  job: JobEntity[];

  @Expose()
  @ApiProperty({ description: 'The creation date of the contract' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The date of the last contract update' })
  updatedAt: Date;

  @Expose()
  @ApiProperty({ description: 'The deletion date of contract if deleted' })
  deletedAt: Date;

  static toViewModel(contract: Contract): ContractVM {
    return plainToClass(ContractVM, contract, { excludeExtraneousValues: true });
  }
}
