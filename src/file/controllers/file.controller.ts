import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Get,
  Response,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { UserGuard } from '../../auth/guard/user.guard';
import { VerifyGuard } from '../../auth/guard/verify.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  // POST / (Upload a file)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): any {
    return this.fileService.uploadFile(file, req.user.id);
  }

  // GET /image/:imageId (Get a file)
  @Get(':imageId')
  async getImage(
    @Param('imageId') imageId: string,
    @Response() res,
  ): Promise<any> {
    const filename = await this.fileService.getProfileImage(imageId);

    const image = await createReadStream(
      join(process.cwd(), `src/file/cache/${filename}`),
    );

    await image.pipe(res);
  }

  // GET / (Get all files)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Get()
  async getFiles(@Request() req: any): Promise<any> {
    return this.fileService.getFiles(req.user.id);
  }

  // DELETE /:fileId (Delete a file)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Delete(':fileId')
  async deleteFile(
    @Param('fileId') fileId: string,
    @Request() req: any,
  ): Promise<any> {
    return this.fileService.deleteFile(fileId, req.user.id);
  }
}