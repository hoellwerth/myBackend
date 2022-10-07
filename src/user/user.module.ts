import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { RegisterService } from './services/register.service';

@Module({
  controllers: [UserController],
  providers: [UserService, RegisterService],
})
export class UserModule {}
