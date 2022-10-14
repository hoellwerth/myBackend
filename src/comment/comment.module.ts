import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { CommentController } from './controllers/comment.controller';
import { PostModule } from '../post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from '../post/models/post.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PostModule,
    AuthModule,
    MongooseModule.forFeature([{ name: 'Comment', schema: PostSchema }]),
  ],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
