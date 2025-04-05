import { Controller, Get, Param, Post, Body } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get(':id')
  getUser(@Param('id') id: string) {
    return { message: 'User profile', id };
  }

  @Post(':id/update')
  updateProfile(@Param('id') id: string, @Body() dto: any) {
    return { message: 'Profile updated', id, data: dto };
  }
}
