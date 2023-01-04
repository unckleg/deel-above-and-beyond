import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { ProfileService } from '../service/profile.service';

@Injectable()
export class ProfileIdGuard implements CanActivate {
  constructor(@Inject(ProfileService) private profileService: ProfileService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.switchToHttp().getRequest().headers;
    const profileId = Number(headers['profile_id']);
    if (!profileId) {
      throw new UnauthorizedException();
    }

    const user = await this.profileService.findByProfileId(profileId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
