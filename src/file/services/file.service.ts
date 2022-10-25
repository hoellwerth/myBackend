import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File } from '../models/file.model';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor(@InjectModel('File') private readonly fileModel: Model<File>) {}

  // Upload a file
  async uploadFile(file: Express.Multer.File, authorId: string): Promise<any> {
    if (!file) {
      throw new BadRequestException('No image uploaded!');
    }

    const Mb = 16_000_000;
    if (file.size > 16 * Mb) {
      throw new BadRequestException('File too large!');
    }

    const newFile = new this.fileModel({
      userId: authorId,
      buffer: file.buffer,
      filename: file.originalname,
    });

    const result = await newFile.save();

    return { new: result.id };
  }

  // Get a file
  async getFile(fileId: string): Promise<any> {
    return this.fileModel.findById(fileId);
  }

  async getProfileImage(pictureId: string): Promise<any> {
    const directory = 'src/file/cache';

    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });

    const profile = await this.getFile(pictureId);

    if (!profile) {
      throw new NotFoundException('Image not found!');
    }
    const img = profile.buffer.toString('base64');

    const data = img.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(data, 'base64');

    fs.writeFileSync(`./${directory}/${profile.filename}`, buf);

    return profile.filename;
  }

  async getFiles(authorId: string): Promise<any> {
    const files = await this.fileModel.find({ userId: authorId });

    const images = [];

    for (const file of files) {
      images.push((await file).id);
    }

    return images;
  }
}
