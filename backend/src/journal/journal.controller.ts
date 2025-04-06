import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JournalService } from './journal.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('journal')
@UseGuards(AuthGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  async getEntries(@Req() req) {
    const userId = req.user.userId;
    return this.journalService.getEntries(userId);
  }

  @Post()
  async createEntry(@Req() req, @Body() body: { title?: string, content: string }) {
    const userId = req.user.userId;
    return this.journalService.createEntry(userId, body);
  }
}
