import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './models/post.model';
import { PostService } from './services/post.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { VoteService } from './services/vote.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
  ],
  providers: [PostService, VoteService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
