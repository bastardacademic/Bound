import { Controller, Post, Get, Body, Param } from '@nestjs/common';

@Controller('messages')
export class MessagingController {
  @Post()
  sendMessage(@Body() dto: any) {
    return { message: 'Message sent', data: dto };
  }

  @Get(':conversationId')
  getMessages(@Param('conversationId') id: string) {
    return { message: 'Messages fetched for conversation', id };
  }
}
