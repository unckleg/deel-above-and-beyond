import { IEntity } from '../shared/IEntity';
import { ContractEntity } from '../../infrastructure/database/mapper/ContractEntity';

export class Job implements IEntity {
  id: number;

  description: string;

  price: number;

  paid: boolean;

  paymentDate?: Date;

  ContractId: number;

  contract?: ContractEntity;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;

  constructor(
    id: number,
    description: string,
    price: number,
    paid: boolean,
    paymentDate: Date,
    ContractId: number,
    contract: ContractEntity,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  ) {
    this.id = id;
    this.description = description;
    this.price = price;
    this.paid = paid;
    this.paymentDate = paymentDate;
    this.ContractId = ContractId;
    this.contract = contract;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  equals(entity: IEntity): boolean {
    if (!(entity instanceof Job)) {
      return false;
    }

    return this.id === entity.id;
  }
}
