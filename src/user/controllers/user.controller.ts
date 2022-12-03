import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterService } from '../services/register.service';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { UserService } from '../services/user.service';
import { UserGuard } from '../../auth/guard/user.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { VerifyGuard } from '../../auth/guard/verify.guard';

@UseGuards(ThrottlerGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly userService: UserService,
  ) {}

  // POST /register (Register a new user)
  @Post('register')
  register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ): any {
    return this.registerService.register(username, password, email);
  }

  // PATCH / (Edit user)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Patch('')
  edit(
    @Request() req: any,
    @Body('new_password') newPassword: string,
    @Body('new_username') newUsername: string,
  ): any {
    return this.userService.editUser(req.user.id, newPassword, newUsername);
  }

  // GET /get (Get current user
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Get('get')
  async getUser(@Request() req: any): Promise<any> {
    const user = await this.userService.getUserById(req.user.id);

    return {
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      status: user.status,
    };
  }

  // GET /name/:username
  @Get('name/:username')
  async getUserByName(@Param('username') username: string): Promise<any> {
    const user = await this.userService.getUserByName(username);

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      status: user.status,
    };
  }
  // GET /getuser/:user_id
  @Get('getuser/:user_id')
  async getUserById(@Param('user_id') userId: string): Promise<any> {
    const user = await this.userService.getUserById(userId);

    return {
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      status: user.status,
    };
  }

  // DELETE / (Delete current user)
  @UseGuards(JwtAuthGuard, UserGuard, VerifyGuard)
  @Delete('')
  async deleteUser(@Request() req: any) {
    return this.userService.deleteUser(req.user.id);
  }

  // PATCH /verify
  @Patch('verify')
  async verifyUser(@Body('token') token: string): Promise<any> {
    return this.userService.verifyUser(token);
  }

  // GET forget-password/:email
  @Get('forget-password/:email')
  async forgotPassword(@Param('email') email: string): Promise<any> {
    return this.userService.sendPasswordConfirmation(email);
  }

  // PATCH reset-password
  @Patch('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('new_password') password: string,
  ): Promise<any> {
    return this.userService.resetPassword(token, password);
  }
}
