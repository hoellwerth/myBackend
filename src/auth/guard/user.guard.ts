import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserStrategy } from '../strategy/user.strategy';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly userStrategy: UserStrategy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.userStrategy.validateRequest(request);
  }
}
