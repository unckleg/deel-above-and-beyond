import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseEntity } from './BaseEntity';
import { ContractEntity } from './ContractEntity';

@Table({ tableName: 'job' })
export class JobEntity extends BaseEntity {
  @Column({ type: DataType.TEXT, allowNull: false })
  description: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  price: number;

  @Column({ defaultValue: false })
  paid: boolean;

  @Column
  paymentDate: Date;

  @ForeignKey(() => ContractEntity)
  @Column
  ContractId: number;

  @BelongsTo(() => ContractEntity)
  contract: ContractEntity;
}
