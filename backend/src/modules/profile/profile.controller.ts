import { Controller, Get, Param } from "@nestjs/common";
import { ProfileService } from "./profile.service";

@Controller("api/profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(":username")
  async getProfile(@Param("username") username: string) {
    return await this.profileService.findByUsername(username);
  }
}
