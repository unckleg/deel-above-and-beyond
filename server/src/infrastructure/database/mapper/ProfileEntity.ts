import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { BaseEntity } from './BaseEntity';
import { ContractEntity } from './ContractEntity';

@Table({ tableName: 'profile' })
export class ProfileEntity extends BaseEntity {
  @Column({ allowNull: false })
  firstName: string;

  @Column({ allowNull: false })
  lastName: string;

  @Column({ allowNull: false })
  profession: string;

  @Column({ type: DataType.DECIMAL(12, 2) })
  balance: number;

  @Column({ type: 'enum', values: ['client', 'contractor'] })
  type: string;

  @HasMany(() => ContractEntity, 'ContractorId')
  contractor: ContractEntity[];

  @HasMany(() => ContractEntity, 'ClientId')
  client: ContractEntity[];
}
