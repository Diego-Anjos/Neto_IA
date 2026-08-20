import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  create(message: string, userId: string) {
    const trimmedMessage = message?.trim();
    if (!trimmedMessage) {
      throw new BadRequestException('A mensagem de feedback é obrigatória.');
    }

    return this.prisma.feedback.create({
      data: {
        message: trimmedMessage,
        userId,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });
  }
}
