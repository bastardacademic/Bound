import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        username: true,
        displayName: true,
        flair: true,
        pronouns: true,
        relationshipStatus: true,
        relationshipOrientation: true,
        pinnedJournalId: true,
        pinnedMediaId: true,
        pinnedJournal: {
          select: {
            id: true,
            title: true,
            excerpt: true
          }
        },
        pinnedMedia: {
          select: {
            id: true,
            title: true,
            mediaUrl: true
          }
        }
      }
    });
  }
}
