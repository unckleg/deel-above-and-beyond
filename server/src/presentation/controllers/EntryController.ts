import { Controller, Param, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiParam, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiSecurity, ApiBody } from '@nestjs/swagger';

import { NotFoundError } from '../errors/NotFoundError';
import { BadRequestError } from '../errors/BadRequestError';
import { CurrentProfileId } from '../../infrastructure/decorator/profile.decorator';
import { ProfileIdGuard } from '../../infrastructure/auth/profileId.guard';
import { ProfileUseCases } from '../../application/use-cases/ProfileUseCases';
import { JobUseCases } from '../../application/use-cases/JobUseCases';
import { JobVM } from '../view-models/jobs/JobVM';
import { ContractVM } from '../view-models/contracts/ContractVM';
import { Contract } from '../../domain/models/Contract';
import { PayoutDTO } from '../dto/PayoutDTO';

@ApiTags('v1')
@Controller()
export class EntryController {
  constructor(private readonly profileUseCases: ProfileUseCases, private readonly jobUseCases: JobUseCases) {}

  @ApiSecurity('Profile-ID')
  @UseGuards(ProfileIdGuard)
  @Get('/contracts')
  @ApiOperation({
    summary: 'Find all non terminated contracts belonging to a user (client or contractor)',
  })
  @ApiOkResponse({ description: 'Contracts founded.', type: [ContractVM] })
  @ApiNotFoundResponse({
    description: 'If the user passed in id not exists.',
    type: NotFoundError,
  })
  async getContracts(@CurrentProfileId() profileId: number): Promise<ContractVM[]> {
    const contracts = await this.profileUseCases.getNonTerminatedContracts(profileId);
    return contracts.map((contract) => ContractVM.toViewModel(contract));
  }

  @ApiSecurity('Profile-ID')
  @UseGuards(ProfileIdGuard)
  @Get('/contracts/:id')
  @ApiOperation({
    summary: 'Find contract that belongs to the profile calling',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The contract id',
  })
  @ApiOkResponse({ description: 'Contract founded.', type: ContractVM })
  @ApiNotFoundResponse({
    description: 'If the user passed in id not exists.',
    type: NotFoundError,
  })
  async getContractById(@CurrentProfileId() profileId: number, @Param('id') contractId: number): Promise<ContractVM> {
    const contract = await this.profileUseCases.getContractById(profileId, contractId);
    return ContractVM.toViewModel(contract);
  }

  @ApiSecurity('Profile-ID')
  @UseGuards(ProfileIdGuard)
  @Get('/jobs/unpaid')
  @ApiOperation({
    summary: 'Find all unpaid active contract jobs belonging to a user (client or contractor)',
  })
  @ApiOkResponse({ description: 'Jobs founded.', type: [ContractVM] })
  @ApiNotFoundResponse({
    description: 'If the user passed in id not exists.',
    type: NotFoundError,
  })
  async getUnpaidActiveContractJobs(@CurrentProfileId() profileId: number): Promise<JobVM[]> {
    const jobs = await this.jobUseCases.getUnpaidActiveContractJobs(profileId);
    return jobs.map((job) => JobVM.toViewModel(job));
  }

  @ApiSecurity('Profile-ID')
  @UseGuards(ProfileIdGuard)
  @Post('/jobs/:job_id/pay')
  @ApiOperation({
    summary: 'Transfer/Payout funds from client to contractor.',
  })
  @ApiParam({
    name: 'job_id',
    type: Number,
    description: 'The job id',
  })
  @ApiBody({
    type: PayoutDTO,
    description: 'The amount to transfer from client to contractor.',
  })
  @ApiOkResponse({ description: 'Fund transfer successful.', type: ContractVM })
  @ApiNotFoundResponse({
    description: 'If the user passed in id not exists.',
    type: NotFoundError,
  })
  @ApiNotFoundResponse({
    description: "If client doesn't have enough money for deposit/payout.",
    type: BadRequestError,
  })
  async depositMoneyToContractor(
    @CurrentProfileId() profileId: number,
    @Param('job_id') jobId: number,
    @Body() payoutDTO: PayoutDTO,
  ): Promise<ContractVM | { error: string }> {
    try {
      const contract = await this.profileUseCases.depositMoneyToContractor(profileId, payoutDTO.amount, jobId);
      return ContractVM.toViewModel(contract as Contract);
    } catch (e: any) {
      return {
        error: `There was an issue while doing payout. Err: ${e}`,
      };
    }
  }

  @ApiSecurity('Profile-ID')
  @UseGuards(ProfileIdGuard)
  @Post('/balances/deposit/:userId')
  @ApiOperation({
    summary: 'Deposit funds to client.',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'The userId',
  })
  @ApiBody({
    type: PayoutDTO,
    description: 'The amount to deposit to client.',
  })
  @ApiOkResponse({ description: 'Fund transfer successful.', type: ContractVM })
  @ApiNotFoundResponse({
    description: 'If the user passed in id not exists.',
    type: NotFoundError,
  })
  @ApiNotFoundResponse({
    description: 'If deposit amount is greater than 25% of clients total jobs to pay.',
    type: BadRequestError,
  })
  async depositMoneyToClient(
    @CurrentProfileId() profileId: number,
    @Param('userId') userId: number,
    @Body() payoutDTO: PayoutDTO,
  ): Promise<ContractVM | { error: string }> {
    try {
      const contract = await this.profileUseCases.depositMoneyToClient(payoutDTO.amount, userId);
      return ContractVM.toViewModel(contract as Contract);
    } catch (e: any) {
      return {
        error: `There was an issue while doing payout to client. Err: ${e}`,
      };
    }
  }
}
