import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @Post('me')
  async updateProfile(@Req() req, @Body() body: { bio?: string, pronouns?: string }) {
    return this.userService.updateProfile(req.user.userId, body);
  }
}
