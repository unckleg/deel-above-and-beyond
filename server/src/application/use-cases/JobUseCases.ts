import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { ContractEntity } from '../../infrastructure/database/mapper/ContractEntity';
import { JobEntity } from '../../infrastructure/database/mapper/JobEntity';
import { Op } from 'sequelize';
import { Job } from '../../domain/models/Job';

@Injectable()
export class JobUseCases {
  constructor(@InjectModel(ContractEntity) private contractEntity: typeof ContractEntity) {}

  async getUnpaidActiveContractJobs(profileId: number): Promise<Job[]> {
    const attributes = ['id', 'description', 'price', 'paid', 'paymentDate', 'ContractId', 'createdAt', 'updatedAt', 'deletedAt'];

    const contracts: ContractEntity[] = await this.contractEntity.findAll({
      where: {
        ContractorId: profileId,
        status: { [Op.ne]: 'terminated' },
      },
      include: {
        model: JobEntity,
        attributes,
        where: {
          paid: false,
        },
      },
    });

    if (!contracts) {
      throw new NotFoundException();
    }

    let jobs: Job[] = [];
    for (const k in contracts) {
      const contract = contracts[k];
      if (contract.job.length > 0) {
        jobs = jobs.concat(
          contract.job.map(
            ({ id, description, price, paid, paymentDate, ContractId, contract, createdAt, updatedAt, deletedAt }: JobEntity) =>
              new Job(id, description, price, paid, paymentDate, ContractId, contract, createdAt, updatedAt, deletedAt),
          ),
        );
      }
    }

    return jobs;
  }
}
