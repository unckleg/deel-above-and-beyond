import { Column, CreatedAt, DeletedAt, Model, UpdatedAt } from 'sequelize-typescript';

export class BaseEntity extends Model {
  @Column({ autoIncrement: true, unique: true, primaryKey: true })
  id: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
