import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { MailService } from '../../mail/services/mail.service';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { Salt } from '../models/salt.model';

const mockUser = (
  username = 'Test',
  email = 'test@test.eu',
  password = 'Test12345678',
  authority = 0,
  permissions: string[] = ['test'],
  role = 'user',
  token: string | null = null,
): User => ({
  username,
  email,
  password,
  authority,
  permissions,
  role,
  token,
});

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;
  let saltModel: Model<Salt>;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            findById: jest.fn().mockResolvedValue(mockUser()),
            findOne: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: getModelToken('Salt'),
          useValue: {
            findOneAndDelete: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendForgetPassword: jest.fn(),
            sendPasswordInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken('User'));
    saltModel = module.get<Model<Salt>>(getModelToken('Salt'));
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user', async () => {
    jest.spyOn(userModel, 'findById').mockReturnValueOnce(mockUser() as any);

    const findMockUser = mockUser();
    const foundUser = await service.getUserById('636421313d2604ab7858f9a8');

    expect(foundUser).toStrictEqual(findMockUser);
  });

  it('should return a user by name', async () => {
    jest.spyOn(userModel, 'findOne').mockReturnValueOnce(mockUser() as any);

    const findMockUser = mockUser();
    const foundUser = await service.getUserByName('Test');

    expect(foundUser).toStrictEqual(findMockUser);
  });

  it('should return a user fitting to a token', async () => {
    jest.spyOn(userModel, 'findOne').mockReturnValueOnce(mockUser() as any);

    const findMockUser = mockUser();
    const foundUser = await service.getUserByToken('12345678');

    expect(foundUser).toStrictEqual(findMockUser);
  });

  it('should delete a user', async () => {
    jest
      .spyOn(userModel, 'findByIdAndDelete')
      .mockReturnValueOnce(mockUser() as any);
    jest
      .spyOn(saltModel, 'findOneAndDelete')
      .mockReturnValueOnce(mockUser() as any);

    const deletedUser = await service.deleteUser('636421313d2604ab7858f9a8');

    expect(deletedUser).toEqual({ success: true });
  });

  it('should edit an user', async () => {
    const salt = jest
      .spyOn(service, 'getSalt')
      .mockReturnValueOnce('12345678' as any);

    const user = jest.spyOn(service, 'getUserById').mockReturnValueOnce({
      save: () => {
        return null;
      },
    } as any);

    await service.editUser('636421313d2604ab7858f9a8', 'Super_Secure', 'test');

    expect(user).toHaveBeenCalled();

    expect(salt).toHaveBeenCalled();
  });

  it('should verify a user', async () => {
    const user = jest.spyOn(service, 'getUserByToken').mockReturnValueOnce({
      save: () => {
        return null;
      },
    } as any);

    await service.verifyUser('636421313d2604ab7858f9a8');

    expect(user).toHaveBeenCalled();
  });

  it('should send a password confirmation', async () => {
    const user = jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
      save: () => {
        return null;
      },
    } as any);

    const mail = jest.spyOn(mailService, 'sendForgetPassword');

    await service.sendPasswordConfirmation('Test');

    expect(user).toHaveBeenCalled();
    expect(mail).toHaveBeenCalled();
  });

  it('should reset the password', async () => {
    const user = jest.spyOn(service, 'getUserByToken').mockReturnValueOnce({
      save: () => {
        return null;
      },
    } as any);

    const salt = jest
      .spyOn(service, 'getSalt')
      .mockReturnValueOnce('12345678' as any);

    const mail = jest.spyOn(mailService, 'sendPasswordInfo');

    await service.resetPassword('12345678', 'Super_Secure');

    expect(user).toHaveBeenCalled();
    expect(mail).toHaveBeenCalled();
    expect(salt).toHaveBeenCalled();
  });

  it('should return a salt', async () => {
    const salt = jest
      .spyOn(saltModel, 'findOne')
      .mockReturnValueOnce({ salt: 'Salt' } as any);

    expect(await service.getSalt('636421313d2604ab7858f9a8')).toBe('Salt');
    expect(salt).toHaveBeenCalled();
  });

  it('should generate a hash', async () => {
    expect(service.hash('Super_Secure')).toBe(
      '2bc358b13fabd51eef32dd7a48e6f11c32de8fedaf26a37dfe74d982dc5cef5df8aaabc758a3cb019abd49a0eb944a50cce5b226b71c3dcca498b72034f8fa3f',
    );
  });

  it('should generate a random id', async () => {
    expect(service.generateId(24)).toHaveLength(24);
  });
});
