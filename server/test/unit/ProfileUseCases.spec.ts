import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ProfileUseCases } from '../../src/application/use-cases/ProfileUseCases';
import { Contract } from '../../src/domain/models/Contract';

describe('ProfileUseCases', () => {
  let profileUseCases: ProfileUseCases;
  let sequelize: Sequelize;
  let profileEntity;
  let contractEntity;
  let jobEntity;

  beforeEach(() => {
    const sqMock = {
      findOne: () => jest.fn().mockResolvedValue({}),
      findAll: () => jest.fn().mockResolvedValue({}),
    };
    sequelize = new Sequelize({ dialect: 'sqlite' });
    sequelize.transaction = jest.fn().mockResolvedValue({
      rollback: jest.fn().mockResolvedValue({}),
      commit: jest.fn().mockResolvedValue({}),
    });
    profileEntity = sqMock;
    contractEntity = sqMock;
    jobEntity = sqMock;
    profileUseCases = new ProfileUseCases(sequelize, profileEntity, contractEntity, jobEntity);
  });

  describe('getProfile', () => {
    it('should return the profile with the given id if it exists', async () => {
      const id = 1;
      const profile = { id };
      jest.spyOn(profileEntity, 'findOne').mockResolvedValue(profile);

      const result = await profileUseCases.getProfile(id);
      expect(result).toEqual(profile);
    });

    it('should throw a NotFoundException if the profile does not exist', async () => {
      const id = 1;
      jest.spyOn(profileEntity, 'findOne').mockResolvedValue(null);

      await expect(profileUseCases.getProfile(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getContractById', () => {
    it('should return the contract with the given id and profileId if it exists', async () => {
      const profileId = 1;
      const contractId = 2;
      const contract = { id: contractId, ContractorId: profileId };
      jest.spyOn(contractEntity, 'findOne').mockResolvedValue(contract);

      const result = await profileUseCases.getContractById(profileId, contractId);
      expect(result).toBeInstanceOf(Contract);
    });

    it('should throw a NotFoundException if the contract does not exist', async () => {
      const profileId = 1;
      const contractId = 2;
      jest.spyOn(contractEntity, 'findOne').mockResolvedValue(null);

      await expect(profileUseCases.getContractById(profileId, contractId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getNonTerminatedContracts', () => {
    it('should return an array of contracts that are not terminated and have the given profileId', async () => {
      const profileId = 1;
      const contracts = [{ ContractorId: profileId, status: 'active' }, { ContractorId: profileId, status: 'pending' }];
      jest.spyOn(contractEntity, 'findAll').mockResolvedValue(contracts);

      const result = await profileUseCases.getNonTerminatedContracts(profileId);
      expect(result).toEqual(
        contracts.map(
          ({ id, terms, status, ContractorId, contractor, ClientId, client, job, createdAt, updatedAt, deletedAt }: any) =>
            new Contract(id, terms, status, ContractorId, contractor, ClientId, client, job, createdAt, updatedAt, deletedAt),
        ),
      );
    });
  });

  describe('depositMoneyToContractor', () => {
    it('should increase the balance of the contractor and decrease the balance of the client', async () => {
      const profileId = 1;
      const amount = 100;
      const jobId = 2;
      const clientProfile = { id: profileId, balance: 1000, save: jest.fn().mockResolvedValue({}) };
      const contractorProfile = { id: 3, balance: 500, save: jest.fn().mockResolvedValue({}) };
      const job = { id: jobId, paid: false, contract: { id: 4, ContractorId: contractorProfile.id }, save: jest.fn().mockResolvedValue({}) };
      jest.spyOn(profileUseCases, 'getProfile').mockImplementationOnce(() => clientProfile as any);
      jest.spyOn(jobEntity, 'findOne').mockImplementationOnce(() => job);
      jest.spyOn(profileUseCases, 'getProfile').mockImplementationOnce(() => contractorProfile as any);
      const result = await profileUseCases.depositMoneyToContractor(profileId, amount, jobId);
      expect(clientProfile.balance).toEqual(900);
      expect(contractorProfile.balance).toEqual(600);
      expect(result).toBeInstanceOf(Contract);
    });

    it('should throw a BadRequestException if the client does not have enough balance', async () => {
      const profileId = 1;
      const amount = 10000;
      const jobId = 2;
      const clientProfile = { id: profileId, balance: 1000 };
      jest.spyOn(profileUseCases, 'getProfile').mockResolvedValue(clientProfile as any);

      await expect(profileUseCases.depositMoneyToContractor(profileId, amount, jobId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a BadRequestException if the amount is not positive', async () => {
      const profileId = 1;
      const amount = -1000;
      const jobId = 2;
      jest.spyOn(profileUseCases, 'getProfile').mockResolvedValue({ id: profileId, balance: 1000 } as any);

      await expect(profileUseCases.depositMoneyToContractor(profileId, amount, jobId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
