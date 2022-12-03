import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from '../services/file.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserGuard } from '../../auth/guard/user.guard';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { VerifyGuard } from '../../auth/guard/verify.guard';

describe('FileController', () => {
  let controller: FileController;

  const mockFileService = {
    uploadFile: jest.fn(),
    getFiles: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 10,
        }),
      ],
      controllers: [FileController],
      providers: [FileService],
    })
      .overrideProvider(FileService)
      .useValue(mockFileService)
      .overrideGuard(ThrottlerGuard)
      .useValue({})
      .overrideGuard(UserGuard)
      .useValue({})
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(VerifyGuard)
      .useValue({})
      .compile();

    controller = module.get<FileController>(FileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call uploadFile', async () => {
    await controller.uploadFile({} as any, { user: { id: '123' } } as any);

    expect(mockFileService.uploadFile).toBeCalled();
  });

  it('should call getFiles', async () => {
    await controller.getFiles({ user: { id: '123' } } as any);

    expect(mockFileService.getFiles).toBeCalled();
  });

  it('should call deleteFile', async () => {
    await controller.deleteFile('123', { user: { id: '123' } } as any);

    expect(mockFileService.deleteFile).toBeCalled();
  });
});
