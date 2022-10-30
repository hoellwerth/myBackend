import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { RegisterService } from './services/register.service';
import { UserSchema } from './models/user.model';
import { SaltSchema } from './models/salt.model';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyStrategy } from '../auth/strategy/verify.strategy';
import { UserStrategy } from '../auth/strategy/user.strategy';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MailModule } from '../mail/mail.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    forwardRef(() => ProfileModule),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Salt', schema: SaltSchema },
    ]),
    MailModule,
  ],
  controllers: [UserController],
  providers: [
    RegisterService,
    UserService,
    VerifyStrategy,
    UserStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
