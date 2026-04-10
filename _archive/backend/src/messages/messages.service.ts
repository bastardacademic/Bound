import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
    const raw = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: true,
        receiver: true
      }
    });

    const convoMap = new Map<string, any>();
    for (const msg of raw) {
      const other = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!convoMap.has(other.id)) {
        convoMap.set(other.id, {
          id: other.id,
          name: other.email,
          lastMessage: msg.content,
          timestamp: msg.createdAt,
          unread: 0
        });
      }
      if (msg.receiverId === userId && !msg.readAt) {
        convoMap.get(other.id).unread += 1;
      }
    }

    return Array.from(convoMap.values());
  }

  async getThread(userId: string, otherUserId: string) {
    await this.prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId: otherUserId,
        readAt: null
      },
      data: { readAt: new Date() }
    });

    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(senderId: string, receiverId: string, content: string) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      }
    });
  }
}
