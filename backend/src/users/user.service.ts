import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        bio: true,
        pronouns: true,
      }
    });
  }

  async updateProfile(userId: string, data: { bio?: string, pronouns?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        bio: data.bio || '',
        pronouns: data.pronouns || '',
      }
    });
  }
}
