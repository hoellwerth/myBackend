import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { UserService } from '../../user/services/user.service';
import { MailService } from '../../mail/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    // get user from database
    const user = await this.userService.getUserByName(username);

    // get salt from database
    const salt = await this.userService.getSalt(user._id);

    // Generate sha512 hashed password
    const hashedPassword = this.hash(password + salt);

    // check if passwords match
    if (user && user.password === hashedPassword) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      name: user.username,
      sub: user._id,
      email: user.email,
    };

    // Send login information email
    await this.mailService.sendUserInformation(user);

    // Sign JsonWebToken
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      id: user._id,
    };
  }

  hash(password) {
    return crypto
      .createHash('sha512')
      .update(JSON.stringify(password))
      .digest('hex');
  }
}
