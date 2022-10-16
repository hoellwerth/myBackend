import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { UserStrategy } from './strategy/user.strategy';
import { VerifyStrategy } from './strategy/verify.strategy';
import { AdminStrategy } from './strategy/admin.strategy';
import { MailModule } from '../mail/mail.module';
import * as dotenv from 'dotenv';

dotenv.config({
  path: 'src/environment/dev.env',
});

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    MailModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserStrategy,
    VerifyStrategy,
    AdminStrategy,
  ],
  exports: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserStrategy,
    VerifyStrategy,
    AdminStrategy,
  ],
})
export class AuthModule {}
