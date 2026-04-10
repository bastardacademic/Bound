import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.journalEntry.findMany({
      where: {
        authorId: userId,
        visibility: {
          in: ["PUBLIC", "SHARED", "PRIVATE"]
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        author: {
          select: {
            username: true,
            displayName: true,
            flair: true,
            pronouns: true,
            mutualGroups: true
          }
        },
        comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                username: true,
                displayName: true,
                flair: true
              }
            }
          }
        }
      }
    });
  }
}
