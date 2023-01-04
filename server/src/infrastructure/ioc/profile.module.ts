import { Module } from '@nestjs/common';
import { ProfileService } from '../service/profile.service';
import { EntryController } from '../../presentation/controllers/EntryController';
import { ProfileUseCases } from '../../application/use-cases/ProfileUseCases';
import { JobUseCases } from '../../application/use-cases/JobUseCases';

@Module({
  imports: [ProfileModule],
  controllers: [EntryController],
  providers: [ProfileService, ProfileUseCases, JobUseCases],
  exports: [ProfileService],
})
export class ProfileModule {}
