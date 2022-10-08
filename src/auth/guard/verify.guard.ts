import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { VerifyStrategy } from '../strategy/verify.strategy';

@Injectable()
export class VerifyGuard implements CanActivate {
  constructor(private verifyStrategy: VerifyStrategy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.verifyStrategy.verifyUser(request);
  }
}
