import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { File } from '../models/file.model';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { mockPost } from '../../post/services/post.service.spec';

export class FileModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue({
    ...this.data,
    _id: 'id',
    save: () => {
      return 'id';
    },
  });
  static find = jest.fn().mockResolvedValue([]);
  static findById = jest.fn().mockResolvedValue({
    ...mockPost(),
    userId: '636421313d2604ab7858f9a8',
    _id: 'id',
    size: 10,
    buffer: '0xf',
    originalname: 'File',
    save: () => {
      return 'id';
    },
  });
  static findOne = jest.fn().mockResolvedValue(mockPost());
  static findOneAndUpdate = jest.fn().mockResolvedValue(mockPost());
  static deleteOne = jest.fn().mockResolvedValue(true);
  static findByIdAndDelete = jest.fn().mockResolvedValue('id');
}

describe('FileService', () => {
  let service: FileService;
  let fileModel: Model<File>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: getModelToken('File'),
          useValue: FileModel,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    fileModel = module.get<Model<File>>(getModelToken('File'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload a file', async () => {
    const file = await service.uploadFile(
      {
        size: 10,
        buffer: '0xf',
        originalname: 'File',
      } as unknown as Express.Multer.File,
      '',
    );

    expect(file.new).toBeUndefined();
  });

  it('should get a file', async () => {
    const file = await service.getFile('id');

    expect(file).toBeDefined();
  });

  it('should get an image', async () => {
    const picture = await service.getImage('id');

    expect(picture).toBeUndefined();
  });

  it('should get all files', async () => {
    const files = await service.getFiles('636421313d2604ab7858f9a8');

    expect(files).toBeDefined();
  });

  it('should delete a file', async () => {
    const file = await service.deleteFile(
      '636421313d2604ab7858f9a8',
      '636421313d2604ab7858f9a8',
    );

    expect(file).toBeDefined();
  });
});
