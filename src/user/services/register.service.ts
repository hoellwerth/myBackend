import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { Salt } from '../models/salt.model';
import { MailService } from '../../mail/services/mail.service';
import { ProfileService } from '../../profile/services/profile.service';

@Injectable()
export class RegisterService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Salt') private readonly saltModel: Model<Salt>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly profileService: ProfileService,
  ) {}

  async register(
    username: string,
    password: string,
    email: string,
  ): Promise<any> {
    // Check Body
    if (!username || !password || !email) {
      throw new BadRequestException('Wrong Body');
    }

    if (username.length > 32) {
      throw new BadRequestException('Too long Body');
    }

    // Check for existing user
    const user: any = await this.userService.getUserByName(username);

    if (user) {
      throw new ConflictException('user_already_exists');
    }

    // Check for existing email
    const query: any = await this.userModel.findOne({ email });

    if (query) {
      throw new ConflictException('email_already_exists');
    }

    // salt password
    const salt = this.salt(password);

    // hash salted password
    const hashedPassword = this.hash(salt);

    // Creating the user
    const newUser = new this.userModel({
      username: username,
      email: email,
      password: hashedPassword,
      authority: 3,
      permissions: ['create_post', 'delete_own_post', 'vote'],
      role: this.generateId(12),
    });

    const result = await newUser.save();

    // Creating the salt entry
    const newSalt = new this.saltModel({
      userId: result.id,
      salt: salt.slice(password.length),
    });
    await newSalt.save();

    // Sending Mail
    await this.mailService.sendUserConfirmation(newUser);

    // Create profile
    await this.profileService.createProfile(result.id);
    return { success: result.id };
  }

  // returns a password with an additional 16 random letters
  salt(password: string) {
    return password + this.generateId(16);
  }

  // returns a sha512 hash
  hash(password: string) {
    return crypto
      .createHash('sha512')
      .update(JSON.stringify(password))
      .digest('hex');
  }

  // Generate a random string with a specific length
  generateId(length: number): any {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
