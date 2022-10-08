import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import * as dotenv from 'dotenv';
import { UserStrategy } from './strategy/user.strategy';
import { VerifyStrategy } from './strategy/verify.strategy';

dotenv.config({
  path: 'src/environment/dev.env',
});

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserStrategy,
    VerifyStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
