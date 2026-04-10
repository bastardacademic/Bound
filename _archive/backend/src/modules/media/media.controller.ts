import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { MediaService } from "./media.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("api/media")
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async getUserMedia(@Req() req) {
    const userId = req.user.id;
    return { posts: await this.mediaService.findByUser(userId) };
  }
}
