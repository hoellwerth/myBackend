import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AdminStrategy {
  constructor(private userService: UserService) {}

  async validateRequest(request: any): Promise<any> {
    const user = await this.userService.getUserById(request.user.id);

    if (!user) {
      return false;
    }

    return user.role === 'admin';
  }
}
