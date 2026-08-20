import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const CONVERSATION_LIST_LIMIT = 200;

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  findByUser(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: CONVERSATION_LIST_LIMIT,
    });
  }

  create(userId: string, title?: string) {
    return this.prisma.conversation.create({
      data: {
        userId,
        title: title?.trim() || 'Nova Conversa',
      },
    });
  }

  async updateTitle(id: string, title: string, userId: string) {
    const updated = await this.prisma.conversation.updateMany({
      where: { id, userId },
      data: { title: title.trim() },
    });

    if (updated.count === 0) {
      throw new NotFoundException('Conversa não encontrada.');
    }

    return this.prisma.conversation.findFirstOrThrow({
      where: { id, userId },
    });
  }

  async remove(id: string, userId: string) {
    const deleted = await this.prisma.conversation.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Conversa não encontrada.');
    }

    return { id };
  }

  removeByUser(userId: string) {
    return this.prisma.conversation.deleteMany({
      where: { userId },
    });
  }
}
