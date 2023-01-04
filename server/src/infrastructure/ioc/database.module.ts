import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '../config';
import { ProfileEntity } from '../database/mapper/ProfileEntity';
import { ContractEntity } from '../database/mapper/ContractEntity';
import { JobEntity } from '../database/mapper/JobEntity';
import { DatabaseSeeder } from '../database/seeder/DatabaseSeeder';
import { ProfileUseCases } from '../../application/use-cases/ProfileUseCases';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([ProfileEntity, ContractEntity, JobEntity]),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.getSequelize(),
        models: [ProfileEntity, ContractEntity, JobEntity],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseSeeder, ProfileUseCases],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
