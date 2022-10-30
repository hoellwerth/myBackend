import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { VerifyGuard } from '../guard/verify.guard';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(authServiceMock)
      .overrideGuard(VerifyGuard)
      .useValue({})
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an object containing jwt & userId', async () => {
    await controller.login({
      user: { username: 'Johannes Höllwerth', password: 'SennaHoj08!?' },
    });

    expect(authServiceMock.login).toHaveBeenCalled();
  });
});
