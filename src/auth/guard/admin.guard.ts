import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AdminStrategy } from '../strategy/admin.strategy';

@Injectable()
export class AdminGuard implements CanActivate {
  
  constructor(private readonly adminStrategy: AdminStrategy) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.adminStrategy.validateRequest(request);
  }
}