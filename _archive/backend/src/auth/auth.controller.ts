import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('signup')
  signup(@Body() dto: any) {
    return { message: 'User signed up', data: dto };
  }

  @Post('login')
  login(@Body() dto: any) {
    return { message: 'User logged in', data: dto };
  }
}
