import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { mockUser } from '../../user/services/user.service.spec';

class MailerServiceMock {
  static sendMail = jest.fn().mockResolvedValue(true);
}
describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: MailerServiceMock,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a userConfirmation', async () => {
    const mail = jest.spyOn(service, 'sendUserConfirmation');
    const spy = jest.spyOn(mailerService, 'sendMail');

    await service.sendUserConfirmation(mockUser());

    expect(mail).toBeCalled();

    expect(spy).toBeCalled();
  });

  it('should send a userInformation', async () => {
    const mail = jest.spyOn(service, 'sendUserInformation');
    const spy = jest.spyOn(mailerService, 'sendMail');

    await service.sendUserInformation(mockUser());

    expect(mail).toBeCalled();

    expect(spy).toBeCalled();
  });

  it('should send a forgot password mail', async () => {
    const mail = jest.spyOn(service, 'sendForgetPassword');
    const spy = jest.spyOn(mailerService, 'sendMail');

    await service.sendForgetPassword(mockUser(), 'token');

    expect(mail).toBeCalled();

    expect(spy).toBeCalled();
  });

  it('should send a forgot password info', async () => {
    const mail = jest.spyOn(service, 'sendPasswordInfo');
    const spy = jest.spyOn(mailerService, 'sendMail');

    await service.sendPasswordInfo(mockUser());

    expect(mail).toBeCalled();

    expect(spy).toBeCalled();
  });
});
