import { IEntity } from '../shared/IEntity';
import { ContractEntity } from '../../infrastructure/database/mapper/ContractEntity';

export class Profile implements IEntity {
  id?: number;

  firstName: string;

  lastName: string;

  profession: string;

  balance: number;

  type: string;

  contractor?: ContractEntity[];

  client?: ContractEntity[];

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;

  constructor(
    id: number,
    firstName: string,
    lastName: string,
    profession: string,
    balance: number,
    type: string,
    contractor: ContractEntity[],
    client: ContractEntity[],
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.profession = profession;
    this.balance = balance;
    this.type = type;
    this.contractor = contractor;
    this.client = client;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  equals(entity: IEntity): boolean {
    if (!(entity instanceof Profile)) {
      return false;
    }

    return this.id === entity.id;
  }
}
