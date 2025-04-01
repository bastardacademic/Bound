import { Controller, Post, Get, Body } from '@nestjs/common';

@Controller('journal')
export class JournalController {
  @Post()
  createEntry(@Body() dto: any) {
    return { message: 'Journal entry created', entry: dto };
  }

  @Get()
  getEntries() {
    return { message: 'Fetched journal entries', entries: [] };
  }
}
