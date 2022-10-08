import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class UserStrategy {
  constructor(private userService: UserService) {}

  async validateRequest(request: any): Promise<any> {
    const user = await this.userService.getUserById(request.user.id);

    if (!user) {
      return false;
    }

    return user.id.toString() === new ObjectId(request.user.id).toString();
  }
}
