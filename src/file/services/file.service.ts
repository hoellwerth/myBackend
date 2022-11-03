import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
      createdAt: new Date(),
    });

    const result = await newFile.save();

    return { new: result.id };
  }

  // Get a file
  async getFile(fileId: string): Promise<any> {
    return this.fileModel.findById(fileId);
  }

  // Get an image
  async getImage(pictureId: string): Promise<any> {
    // Clear current cache
    const directory = 'src/file/cache';

    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });

    // Get image from database
    const file = await this.getFile(pictureId);

    if (!file) {
      throw new NotFoundException('Image not found!');
    }

    const img = file.buffer.toString('base64');

    const data = img.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(data, 'base64');

    fs.writeFileSync(`./${directory}/${file.filename}`, buf);

    return file.filename;
  }

  // Get all files
  async getFiles(authorId: string): Promise<any> {
    const files: any = await this.fileModel.find({ userId: authorId });

    const images = [];

    for (const file of files) {
      images.push({
        id: (await file).id,
        filename: (await file).filename,
        uploaded: (await file).createdAt,
      });
    }

    return images;
  }

  // delete a file
  async deleteFile(fileId: string, userId: string): Promise<any> {
    const file = await this.fileModel.findById(fileId);

    if (!file) {
      throw new NotFoundException('File not found!');
    }

    if (file.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this file!',
      );
    }

    await this.fileModel.deleteOne({ _id: fileId });

    return { deleted: fileId };
  }
}
