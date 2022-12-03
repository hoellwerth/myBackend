import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class VerifyStrategy {
  constructor(private userService: UserService) {}

  async verifyUser(request: any): Promise<any> {
    const user = await this.userService.getUserById(request.user.id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user && !user.token;
  }
}
