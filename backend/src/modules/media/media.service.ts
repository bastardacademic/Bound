import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.mediaPost.findMany({
      where: {
        uploaderId: userId,
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
        tags: true,
        mediaUrl: true,
        createdAt: true,
        visibility: true,
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
