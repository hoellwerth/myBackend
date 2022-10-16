import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ProfileService } from '../services/profile.service';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { UserGuard } from '../../auth/guard/user.guard';
import { VerifyGuard } from '../../auth/guard/verify.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from '../pipes/sharp.pipe';

@Throttle()
@UseGuards(ThrottlerGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // GET /:userId (Get user's profile)
  @Get('userId')
  getProfile(@Param('userId') userId: string): any {
    const profile: any = this.profileService.getProfile(userId);
    return {
      status: profile.status,
      bio: profile.bio,
      followers: profile.followers,
      following: profile.following,
    };
  }

  // POST / (toggle following the user)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Post(':targetId')
  toggleFollow(
    @Param('targetId') targetId: string,
    @Request() req: any,
  ): Promise<any> {
    return this.profileService.toggleFollow(targetId, req.user.id);
  }

  // PATCH / (Edit the user's profile)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Patch(':userId')
  editStatus(
    @Param('userId') userId: string,
    @Body('status') status: string,
    @Body('bio') bio: string,
  ): any {
    return this.profileService.editProfile(userId, status, bio);
  }

  // POST /picture (Post a picture)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Post('picture')
  @UseInterceptors(FileInterceptor('profile-picture'))
  uploadFile(
    @UploadedFile(SharpPipe) file: string,
    @Request() req: any,
  ): Promise<any> {
    return this.profileService.uploadPicture(file, req.user.id);
  }

  // GET /picture/:userId (Get a specific picture)
  @Get('picture/:userId')
  getPicture(@Param('userid') userId: string): any {
    const profile: any = this.profileService.getProfile(userId);

    return { buffer: profile.buffer, filename: profile.filename };
  }
}
