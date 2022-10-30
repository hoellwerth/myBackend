import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ProfileService } from '../services/profile.service';
import { UserGuard } from '../../auth/guard/user.guard';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { VerifyGuard } from '../../auth/guard/verify.guard';

describe('ProfileController', () => {
  let controller: ProfileController;

  const mockProfileService = {
    getProfile: jest.fn(() => {
      return {
        status: 'Test',
        bio: 'Test',
        followers: [],
        following: [],
      };
    }),
    toggleFollow: jest.fn(),
    editProfile: jest.fn(),
    uploadPicture: jest.fn(),
    getProfileImage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 10,
        }),
      ],
      controllers: [ProfileController],
      providers: [ProfileService],
    })
      .overrideProvider(ProfileService)
      .useValue(mockProfileService)
      .overrideGuard(ThrottlerGuard)
      .useValue({})
      .overrideGuard(UserGuard)
      .useValue({})
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(VerifyGuard)
      .useValue({})
      .compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getProfile', async () => {
    await controller.getProfile('123');

    expect(mockProfileService.getProfile).toBeCalled();
  });

  it('should call follow', async () => {
    await controller.toggleFollow('123', { user: { id: '123' } });

    expect(mockProfileService.toggleFollow).toBeCalled();
  });

  it('should call editProfile', async () => {
    await controller.editProfile('123', 'Status', 'Bio');

    expect(mockProfileService.editProfile).toBeCalled();
  });

  it('should call uploadPicture', async () => {
    await controller.uploadPicture('file', { user: { id: '123' } });

    expect(mockProfileService.uploadPicture).toBeCalled();
  });
});
