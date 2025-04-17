import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller("api/journal")
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  async getUserJournals(@Req() req) {
    const userId = req.user.id;
    return { entries: await this.journalService.findByUser(userId) };
  }
}
