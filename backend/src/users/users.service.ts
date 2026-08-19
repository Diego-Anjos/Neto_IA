import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type AuthUserPayload = {
  email: string;
  password: string;
  name?: string;
};

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  language: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: publicUserSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async auth({ email, password, name }: AuthUserPayload) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.passwordHash !== password) {
        throw new UnauthorizedException('Credenciais inválidas.');
      }

      return {
        id: existing.id,
        name: existing.name,
        email: existing.email,
        language: existing.language,
        createdAt: existing.createdAt,
      };
    }

    const created = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: password,
        name: name?.trim() || normalizedEmail.split('@')[0],
      },
      select: publicUserSelect,
    });

    return created;
  }
}
