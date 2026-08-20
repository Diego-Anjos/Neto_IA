import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  hashPassword,
  isHashedPassword,
  verifyPassword,
} from '../auth/password';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthDto } from './dto/auth.dto';

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

  async auth({ email, password, name }: AuthDto) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      const matches = await verifyPassword(password, existing.passwordHash);
      if (!matches) {
        throw new UnauthorizedException('Credenciais inválidas.');
      }

      if (!isHashedPassword(existing.passwordHash)) {
        await this.prisma.user.update({
          where: { id: existing.id },
          data: { passwordHash: await hashPassword(password) },
        });
      }

      return {
        id: existing.id,
        name: existing.name,
        email: existing.email,
        language: existing.language,
        createdAt: existing.createdAt,
      };
    }

    return this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash: await hashPassword(password),
        name: name?.trim() || normalizedEmail.split('@')[0],
      },
      select: publicUserSelect,
    });
  }
}
