import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guard/local.guard';
import { VerifyGuard } from '../guard/verify.guard';
import { AuthService } from '../services/auth.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@Throttle()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /login (Login user)
  @UseGuards(LocalAuthGuard, VerifyGuard)
  @Post('login')
  async login(@Request() req: any): Promise<any> {
    return this.authService.login(req.user);
  }
}
