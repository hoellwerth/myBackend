import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { MailModule } from './mail/mail.module';

dotenv.config({ path: 'src/environment/dev.env' });

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, { dbName: 'test' }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
    UserModule,
    AuthModule,
    PostModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
