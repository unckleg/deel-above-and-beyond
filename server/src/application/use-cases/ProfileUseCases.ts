import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { ProfileEntity } from '../../infrastructure/database/mapper/ProfileEntity';
import { ContractEntity } from '../../infrastructure/database/mapper/ContractEntity';
import { Contract } from '../../domain/models/Contract';
import { JobEntity } from '../../infrastructure/database/mapper/JobEntity';

@Injectable()
export class ProfileUseCases {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(ProfileEntity) private profileEntity: typeof ProfileEntity,
    @InjectModel(ContractEntity) private contractEntity: typeof ContractEntity,
    @InjectModel(JobEntity) private jobEntity: typeof JobEntity,
  ) {}

  async getProfile(id: number): Promise<ProfileEntity> {
    const profile = await this.profileEntity.findOne({ where: { id } });
    if (!profile) {
      throw new NotFoundException(`Profile with ${id} id not found.`);
    }

    return profile;
  }

  async getContractById(profileId: number, contractId: number): Promise<Contract> {
    const contract = await this.contractEntity.findOne({ where: { id: contractId, ContractorId: profileId } });
    if (!contract) {
      throw new NotFoundException();
    }

    const { id, terms, status, ContractorId, contractor, ClientId, client, job, createdAt, updatedAt, deletedAt } = contract;
    return new Contract(id, terms, status, ContractorId, contractor, ClientId, client, job, createdAt, updatedAt, deletedAt);
  }

  async getNonTerminatedContracts(profileId: number): Promise<Contract[]> {
    const contracts = await this.contractEntity.findAll({
      where: {
        ContractorId: profileId,
        status: { [Op.ne]: 'terminated' },
      },
    });

    return contracts.map(
      ({ id, terms, status, ContractorId, contractor, ClientId, client, job, createdAt, updatedAt, deletedAt }: ContractEntity) =>
        new Contract(id, terms, status, ContractorId, contractor, ClientId, client, job, createdAt, updatedAt, deletedAt),
    );
  }

  async depositMoneyToContractor(profileId: number, amount: number, jobId: number): Promise<Contract | void> {
    const profile = await this.getProfile(profileId);
    if (profile.balance < amount || amount <= 0) {
      throw new BadRequestException(`Not enough balance on your account.`);
    }

    const t = await this.sequelize.transaction();
    try {
      // Decrease client balance first
      profile.balance -= amount;
      await profile.save({ transaction: t });

      // Update job payment date
      const job = await this.jobEntity.findOne({
        where: { id: jobId },
        include: {
          model: ContractEntity,
          attributes: ['ContractorId', 'id'],
        },
      });
      job.paid = true;
      await job.save({ transaction: t });

      // Increase funds on contractors account
      const contractor = await this.getProfile(job.contract.ContractorId);
      contractor.balance += amount;
      await contractor.save({ transaction: t });

      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await t.commit();

      const {
        id,
        terms,
        status,
        ContractorId,
        contractor: c,
        ClientId,
        client,
        job: j,
        createdAt,
        updatedAt,
        deletedAt,
      } = (await this.contractEntity.findOne({ where: { id: job.contract.id } })) as ContractEntity;
      return new Contract(id, terms, status, ContractorId, c, ClientId, client, j, createdAt, updatedAt, deletedAt);
    } catch (err) {
      // If the execution reaches this line, an error was thrown.
      // We roll back the transaction.
      await t.rollback();
      throw new BadRequestException(err);
    }
  }

  async depositMoneyToClient(amount: number, userId: number) {
    const profile = await this.getProfile(userId);
    const contract = await this.contractEntity.findOne({
      where: {
        ClientId: userId,
        status: { [Op.ne]: 'terminated' },
      },
      include: {
        model: JobEntity,
        attributes: ['price'],
        where: {
          paid: false,
        },
      },
    });

    if (!contract) {
      throw new BadRequestException(`Cant find contracts for ${userId} userId.`);
    }

    const totalJobsToPay = (contract.job || []).map(({ price }: JobEntity) => price).reduce((partialSum, a) => partialSum + a, 0);
    if (totalJobsToPay <= 0) {
      throw new BadRequestException(`There are no jobs to be payed.`);
    }

    if (amount > totalJobsToPay * 0.25) {
      throw new BadRequestException(`Cannot deposit more than 25% of total jobs to pay.`);
    }

    const t = await this.sequelize.transaction();
    try {
      // Increase client balance
      profile.balance += amount;
      await profile.save({ transaction: t });
      // If the execution reaches this line, no errors were thrown.
      // We commit the transaction.
      await t.commit();

      const { id, terms, status, ContractorId, contractor, ClientId, client, job, createdAt, updatedAt, deletedAt } = contract;
      return new Contract(id, terms, status, ContractorId, contractor, ClientId, client, job, createdAt, updatedAt, deletedAt);
    } catch (err) {
      await t.rollback();
      throw new BadRequestException(err);
    }
  }
}
