import { IEntity } from '../shared/IEntity';
import { ProfileEntity } from '../../infrastructure/database/mapper/ProfileEntity';
import { JobEntity } from '../../infrastructure/database/mapper/JobEntity';

export class Contract implements IEntity {
  id: number;

  terms: string;

  status: string;

  ContractorId: number;

  contractor?: ProfileEntity;

  ClientId: number;

  client?: ProfileEntity;

  job?: JobEntity[];

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;

  constructor(
    id: number,
    terms: string,
    status: string,
    ContractorId: number,
    contractor: ProfileEntity,
    ClientId: number,
    client: ProfileEntity,
    job: JobEntity[],
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  ) {
    this.id = id;
    this.terms = terms;
    this.status = status;
    this.ContractorId = ContractorId;
    this.contractor = contractor;
    this.ClientId = ClientId;
    this.client = client;
    this.job = job;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }

  equals(entity: IEntity): boolean {
    if (!(entity instanceof Contract)) {
      return false;
    }

    return this.id === entity.id;
  }
}
