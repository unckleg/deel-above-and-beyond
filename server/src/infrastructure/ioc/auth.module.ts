import { Module } from '@nestjs/common';
import { ProfileModule } from './profile.module';
import { ProfileService } from '../service/profile.service';

@Module({
  imports: [ProfileModule],
  providers: [ProfileService],
})
export class AuthModule {}
