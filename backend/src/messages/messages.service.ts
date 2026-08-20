import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const MESSAGE_LIST_LIMIT = 500;
const MAX_CONTENT_CHARS = 50_000;

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByConversation(conversationId: string, userId: string) {
    await this.ensureOwnedConversation(conversationId, userId);

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      take: MESSAGE_LIST_LIMIT,
    });
  }

  async create(
    conversationId: string,
    role: 'user' | 'assistant',
    content: unknown,
    userId: string,
  ) {
    await this.ensureOwnedConversation(conversationId, userId);

    const serializedContent =
      typeof content === 'string' ? content : JSON.stringify(content);

    if (!serializedContent.trim()) {
      throw new BadRequestException('O conteúdo da mensagem é obrigatório.');
    }

    if (serializedContent.length > MAX_CONTENT_CHARS) {
      throw new BadRequestException('Mensagem excede o tamanho máximo permitido.');
    }

    const [message] = await this.prisma.$transaction([
      this.prisma.message.create({
        data: {
          conversationId,
          role,
          content: serializedContent,
        },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  }

  private async ensureOwnedConversation(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      select: { id: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada.');
    }

    return conversation;
  }
}
