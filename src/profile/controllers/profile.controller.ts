import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ProfileService } from '../services/profile.service';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { UserGuard } from '../../auth/guard/user.guard';
import { VerifyGuard } from '../../auth/guard/verify.guard';

@Throttle()
@UseGuards(ThrottlerGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // PATCH status (Edit the user's status
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Patch(':userId')
  editStatus(
    @Param('userId') userId: string,
    @Body('status') status: string,
    @Body('bio') bio: string,
  ): any {
    return this.profileService.editProfile(userId, status, bio);
  }
}
