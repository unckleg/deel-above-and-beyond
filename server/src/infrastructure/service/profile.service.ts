import { Injectable } from '@nestjs/common';
import { ProfileEntity } from '../database/mapper/ProfileEntity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(ProfileEntity) private profileEntity: typeof ProfileEntity) {}

  async findByProfileId(profileId: number) {
    return await this.profileEntity.findOne({ where: { id: profileId } });
  }
}
