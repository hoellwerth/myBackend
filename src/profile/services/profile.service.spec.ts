import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { Model } from 'mongoose';
import { Profile } from '../models/profile.model';
import { getModelToken } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';

export const mockProfile = (
  userId = '636421313d2604ab7858f9a8',
  status: string | null = 'Test',
  bio: string | null = 'Test',
  followers: string[] = ['636421313d2604ab7858f9a8'],
  following: string[] = ['636421313d2604ab7858f9a8'],
  buffer: object = {},
  filename = 'Test',
): Profile => ({
  userId,
  status,
  bio,
  followers,
  following,
  buffer,
  filename,
});

class ProfileModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue({
    ...this.data,
    save: () => {
      return 'id';
    },
  });
  static find = jest.fn().mockResolvedValue([]);
  static findById = jest.fn().mockResolvedValue({
    _id: 'id',
    save: () => {
      return 'id';
    },
  });
  static findOne = jest.fn().mockResolvedValue({
    ...mockProfile(),
    save: () => {
      return 'id';
    },
  });
  static findOneAndUpdate = jest.fn().mockResolvedValue(mockProfile());
  static deleteOne = jest.fn().mockResolvedValue(true);
  static findByIdAndDelete = jest.fn().mockResolvedValue('id');
  static updateOne = jest.fn().mockResolvedValue({
    ...mockProfile(),
    save: () => {
      return 'id';
    },
  });
}

describe('ProfileService', () => {
  let service: ProfileService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let profileModel: Model<Profile>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getModelToken('Profile'),
          useValue: ProfileModel,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileModel = module.get<Model<Profile>>(getModelToken('Profile'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a profile', async () => {
    const profile = await service.getProfile('636421313d2604ab7858f9a8');

    expect(JSON.stringify(profile)).toBe(JSON.stringify(mockProfile()));
  });

  it('should create a profile', async () => {
    const profile = await service.createProfile('636421313d2604ab7858f9a8');

    expect(JSON.stringify(profile)).toBe(
      JSON.stringify({
        success: {
          userId: '636421313d2604ab7858f9a8',
          status: null,
          bio: null,
          save: () => {
            return 'id';
          },
        },
      }),
    );
  });

  it('should update a profile', async () => {
    const profile = await service.editProfile(
      '636421313d2604ab7858f9a8',
      'Test',
      'Test',
    );

    expect(JSON.stringify(profile)).toBe(
      JSON.stringify({
        success: true,
      }),
    );
  });

  it('should togglo following a profile', async () => {
    const profile = await service.toggleFollow(
      '636421313d2604ab7858f9a8',
      '636421313d2604ab7858f9a8',
    );

    expect(JSON.stringify(profile)).toBe(
      JSON.stringify({
        success: true,
      }),
    );
  });

  it('should upload a profile picture', async () => {
    fs.copyFileSync(
      './src/profile/services/test/test.jpeg',
      './src/profile/cache/test.jpeg',
    );

    const profile = await service.uploadPicture(
      'test.jpeg',
      '636421313d2604ab7858f9a8',
    );

    expect(JSON.stringify(profile)).toBe(JSON.stringify({}));
  });

  it('should get a profile image', async () => {
    const filename = await service.getProfileImage('636421313d2604ab7858f9a8');

    const picture = fs.readFileSync(
      path.join(__dirname, `../cache/${filename}`),
    );

    expect(picture).toBeDefined();
  });
});
