import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(message: string, userId?: string | null) {
    const trimmedMessage = message?.trim();
    if (!trimmedMessage) {
      throw new BadRequestException('A mensagem de feedback é obrigatória.');
    }

    let resolvedUserId: string | null = userId?.trim() || null;
    if (resolvedUserId) {
      const user = await this.prisma.user.findUnique({
        where: { id: resolvedUserId },
        select: { id: true },
      });
      if (!user) {
        resolvedUserId = null;
      }
    }

    return this.prisma.feedback.create({
      data: {
        message: trimmedMessage,
        userId: resolvedUserId,
      },
    });
  }
}
