import { forwardRef, Module } from '@nestjs/common';
import { ProfileService } from './services/profile.service';
import { ProfileController } from './controllers/profile.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from './models/profile.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: 'Profile', schema: ProfileSchema }]),
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
