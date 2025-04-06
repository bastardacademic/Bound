import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JournalService } from './journal.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('journal')
@UseGuards(AuthGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  async getEntries(@Req() req) {
    return this.journalService.getEntries(req.user.userId);
  }

  @Post()
  async createEntry(@Req() req, @Body() body: { title?: string, content: string }) {
    return this.journalService.createEntry(req.user.userId, body);
  }
}
