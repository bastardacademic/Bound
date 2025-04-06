import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async getEntries(userId: string) {
    return this.prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createEntry(userId: string, data: { title?: string, content: string }) {
    return this.prisma.journalEntry.create({
      data: {
        title: data.title || '',
        content: data.content,
        userId,
      },
    });
  }
}
