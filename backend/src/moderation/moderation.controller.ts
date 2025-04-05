import { Controller, Post, Get, Body } from '@nestjs/common';

@Controller('moderation')
export class ModerationController {
  @Post('report')
  reportContent(@Body() dto: any) {
    return { message: 'Content reported', data: dto };
  }

  @Get('queue')
  getQueue() {
    return { message: 'Moderation queue', items: [] };
  }
}
