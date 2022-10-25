import { Module } from '@nestjs/common';
import { FileController } from './controllers/file.controller';
import { FileService } from './services/file.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from './models/file.model';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: 'File',
        schema: FileSchema,
      },
    ]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
