import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getConversations(@Req() req) {
    return this.messagesService.getConversations(req.user.userId);
  }

  @Get(':userId')
  async getThread(@Req() req, @Param('userId') userId: string) {
    return this.messagesService.getThread(req.user.userId, userId);
  }

  @Post(':userId')
  async sendMessage(@Req() req, @Param('userId') userId: string, @Body() body: { content: string }) {
    return this.messagesService.sendMessage(req.user.userId, userId, body.content);
  }
}
