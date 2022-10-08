import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { UserStrategy } from '../auth/strategy/user.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './models/post.model';
import { PostService } from './services/post.service';
import { VerifyStrategy } from '../auth/strategy/verify.strategy';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { VoteService } from './services/vote.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
  ],
  providers: [PostService, VoteService],
  controllers: [PostController],
})
export class PostModule {}
