import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../mail/services/mail.service';
import { User } from '../../user/models/user.model';

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

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
            getUserByName: jest.fn(),
            getUserByToken: jest.fn(),
            deleteUser: jest.fn(),
            editUser: jest.fn(),
            verifyUser: jest.fn(),
            sendPasswordConfirmation: jest.fn(),
            resetPassword: jest.fn(),
            getSalt: jest.fn(),
            hash: jest.fn(),
            generateId: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn(),
            verify: jest.fn(),
            verifyAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendUserConfirmation: jest.fn(),
            sendUserInformation: jest.fn(),
            sendForgetPassword: jest.fn(),
            sendPasswordInformation: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user', async () => {
    const user = jest
      .spyOn(userService, 'getUserByName')
      .mockReturnValueOnce(mockUser() as any);

    const salt = jest.spyOn(userService, 'getSalt').mockResolvedValue('salt');

    const result = await service.validateUser('Johannes Höllwerth', 'test');

    expect(user).toHaveBeenCalled();
    expect(salt).toHaveBeenCalled();

    expect(result).toBeNull();
  });

  it('should return a jwt', async () => {
    const user = mockUser();

    const mail = jest
      .spyOn(mailService, 'sendUserInformation')
      .mockResolvedValue();
    const jwt = jest.spyOn(jwtService, 'sign').mockReturnValueOnce('test');

    const result = await service.login(user);

    expect(jwt).toHaveBeenCalled();
    expect(mail).toHaveBeenCalled();

    expect(result).toEqual({
      access_token: 'test',
      userId: undefined,
    });
  });

  it('should generate a hash', async () => {
    expect(service.hash('Super_Secure')).toBe(
      '2bc358b13fabd51eef32dd7a48e6f11c32de8fedaf26a37dfe74d982dc5cef5df8aaabc758a3cb019abd49a0eb944a50cce5b226b71c3dcca498b72034f8fa3f',
    );
  });
});
