import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { MailModule } from './mail/mail.module';
import { CommentModule } from './comment/comment.module';
import { ProfileModule } from './profile/profile.module';
import { FileModule } from './file/file.module';

dotenv.config({ path: 'src/environment/dev.env' });

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, { dbName: process.env.DB_NAME }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    UserModule,
    AuthModule,
    PostModule,
    MailModule,
    CommentModule,
    ProfileModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
