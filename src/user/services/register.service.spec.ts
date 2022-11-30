import { Test, TestingModule } from '@nestjs/testing';
import { RegisterService } from './register.service';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { MailService } from '../../mail/services/mail.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { ProfileService } from '../../profile/services/profile.service';

class UserModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockResolvedValue([]);
  static findOne = jest.fn().mockResolvedValue([]);
  static findOneAndUpdate = jest.fn().mockResolvedValue([]);
  static deleteOne = jest.fn().mockResolvedValue(true);
}

class SaltModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockResolvedValue([]);
  static findOne = jest.fn().mockResolvedValue([]);
  static findOneAndUpdate = jest.fn().mockResolvedValue([]);
  static deleteOne = jest.fn().mockResolvedValue(true);
}

describe('RegisterService', () => {
  let service: RegisterService;
  let userModel: Model<User>;
  let userService: UserService;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: getModelToken('User'),
          useValue: UserModel,
        },
        {
          provide: getModelToken('Salt'),
          useValue: SaltModel,
        },
        {
          provide: UserService,
          useValue: {
            getUserByName: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendForgetPassword: jest.fn(),
            sendPasswordInfo: jest.fn(),
            sendUserConfirmation: jest.fn(),
          },
        },
        {
          provide: ProfileService,
          useValue: {
            createProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    userModel = module.get<Model<User>>(getModelToken('User'));
    userService = module.get<UserService>(UserService);
    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user', async () => {
    const user = jest
      .spyOn(userService, 'getUserByName')
      .mockReturnValueOnce(null);

    const email = jest.spyOn(userModel, 'findOne').mockReturnValueOnce(null);

    const profile = jest
      .spyOn(profileService, 'createProfile')
      .mockReturnValueOnce(null);

    const newUser = await service.register(
      'Test',
      'Super_Secure',
      'test@test.at',
    );

    expect(user).toHaveBeenCalled();
    expect(email).toHaveBeenCalled();
    expect(profile).toHaveBeenCalled();

    expect(newUser).toBeDefined();
  });
});
