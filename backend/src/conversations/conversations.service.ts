import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  findByUser(userId: string) {
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(userId: string, title?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.prisma.conversation.create({
      data: {
        userId,
        title: title || 'Nova Conversa',
      },
    });
  }

  async updateTitle(id: string, title: string) {
    await this.ensureExists(id);
    return this.prisma.conversation.update({
      where: { id },
      data: { title },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.conversation.delete({ where: { id } });
  }

  async removeByUser(userId: string) {
    return this.prisma.conversation.deleteMany({ where: { userId } });
  }

  private async ensureExists(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
    });
    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada.');
    }
    return conversation;
  }
}
