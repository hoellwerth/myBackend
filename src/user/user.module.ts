import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { RegisterService } from './services/register.service';
import { UserSchema } from './models/user.model';
import { SaltSchema } from './models/salt.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Salt', schema: SaltSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, RegisterService],
})
export class UserModule {}
