import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { RegisterService } from '../services/register.service';
import { VerifyStrategy } from '../../auth/strategy/verify.strategy';
import { UserStrategy } from '../../auth/strategy/user.strategy';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserGuard } from '../../auth/guard/user.guard';
import { VerifyGuard } from '../../auth/guard/verify.guard';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { LocalAuthGuard } from '../../auth/guard/local.guard';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'src/environment/dev.env' });

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    editUser: jest.fn(),
    getUserByName: jest.fn((name: string) => {
      return {
        _id: '123',
        username: name,
        email: '',
        role: '',
        bio: '',
        status: '',
      };
    }),
    getUserById: jest.fn((id: string) => {
      return {
        _id: id,
        username: 'Test',
        email: '',
        role: '',
        bio: '',
        status: '',
      };
    }),
    deleteUser: jest.fn(),
    verifyUser: jest.fn(),
    sendPasswordConfirmation: jest.fn(),
    resetPassword: jest.fn(),
  };
  const mockRegisterService = {
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 10,
        }),
      ],
      controllers: [UserController],
      providers: [
        RegisterService,
        UserService,
        VerifyStrategy,
        UserStrategy,
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(RegisterService)
      .useValue(mockRegisterService)
      .overrideProvider(VerifyStrategy)
      .useValue({})
      .overrideProvider(UserStrategy)
      .useValue({})
      .overrideGuard(ThrottlerGuard)
      .useValue({})
      .overrideGuard(UserGuard)
      .useValue({})
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(VerifyGuard)
      .useValue({})
      .overrideGuard(LocalAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call register', async () => {
    await controller.register(
      'Johannes Höllwerth',
      process.env.TEST_PASSWORD,
      'johannes.hoellwerth@protonmail.com',
    );

    expect(mockRegisterService.register).toHaveBeenCalled();
  });

  it('should call edit user', async () => {
    await controller.edit(
      { user: { id: Date.now().toString() } },
      process.env.TEST_PASSWORD,
      Date.now().toString(),
    );

    expect(mockUserService.editUser).toHaveBeenCalled();
  });

  it('should call get current user', async () => {
    await controller.getUser({ user: { id: Date.now().toString() } });

    expect(mockUserService.getUserById).toHaveBeenCalled();
  });

  it('should call getUserById', async () => {
    await controller.getUserById(Date.now().toString());

    expect(mockUserService.getUserById).toHaveBeenCalled();
  });

  it('should call getUserByName', async () => {
    await controller.getUserByName('Johannes Höllwerth');

    expect(mockUserService.getUserByName).toHaveBeenCalled();
  });

  it('should call deleteUser', async () => {
    await controller.deleteUser({ user: { id: Date.now().toString() } });

    expect(mockUserService.deleteUser).toHaveBeenCalled();
  });

  it('should call verifyUser', async () => {
    await controller.verifyUser('123');

    expect(mockUserService.verifyUser).toHaveBeenCalled();
  });

  it('should call forgotPassword', async () => {
    await controller.forgotPassword('johannes.hoellwerth@protonmail.com');

    expect(mockUserService.sendPasswordConfirmation).toHaveBeenCalled();
  });

  it('should call resetPassword', async () => {
    await controller.resetPassword('123', process.env.TEST_PASSWORD);

    expect(mockUserService.resetPassword).toHaveBeenCalled();
  });
});
