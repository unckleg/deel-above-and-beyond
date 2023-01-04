import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseEntity } from './BaseEntity';
import { ProfileEntity } from './ProfileEntity';
import { JobEntity } from './JobEntity';

@Table({ tableName: 'contract' })
export class ContractEntity extends BaseEntity {
  @Column({ type: DataType.TEXT, allowNull: false })
  terms: string;

  @Column({ type: 'enum', values: ['new', 'in_progress', 'terminated'] })
  status: string;

  @ForeignKey(() => ProfileEntity)
  @Column
  ContractorId: number;

  @BelongsTo(() => ProfileEntity)
  contractor: ProfileEntity;

  @ForeignKey(() => ProfileEntity)
  @Column
  ClientId: number;

  @BelongsTo(() => ProfileEntity)
  client: ProfileEntity;

  @HasMany(() => JobEntity, 'ContractId')
  job: JobEntity[];
}
