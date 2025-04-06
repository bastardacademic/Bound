import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getSettings(@Req() req) {
    return this.settingsService.getSettings(req.user.userId);
  }

  @Post()
  async saveSettings(@Req() req, @Body() body) {
    return this.settingsService.saveSettings(req.user.userId, body);
  }
}
