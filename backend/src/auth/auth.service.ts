import { createHmac, timingSafeEqual } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from './auth.types';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type TokenPayload = {
  sub: string;
  exp: number;
};

@Injectable()
export class AuthService {
  private readonly secret: string;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = this.config.get<string>('JWT_SECRET')?.trim();
    if (!secret || secret.length < 16) {
      throw new Error(
        'JWT_SECRET deve estar definida no ambiente e ter pelo menos 16 caracteres.',
      );
    }
    this.secret = secret;
  }

  sign(user: { id: string }) {
    const payload: TokenPayload = {
      sub: user.id,
      exp: Date.now() + TOKEN_TTL_MS,
    };
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = createHmac('sha256', this.secret)
      .update(body)
      .digest('base64url');
    return `${body}.${signature}`;
  }

  async resolveUserFromToken(token: string): Promise<AuthUser> {
    const [body, signature] = token.split('.');
    if (!body || !signature || token.split('.').length !== 2) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    const expected = createHmac('sha256', this.secret)
      .update(body)
      .digest('base64url');
    const provided = Buffer.from(signature);
    const valid = Buffer.from(expected);

    if (
      provided.length !== valid.length ||
      !timingSafeEqual(provided, valid)
    ) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    let payload: TokenPayload;
    try {
      payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    } catch {
      throw new UnauthorizedException('Sessão inválida.');
    }

    if (
      typeof payload?.sub !== 'string' ||
      typeof payload.exp !== 'number' ||
      payload.exp < Date.now()
    ) {
      throw new UnauthorizedException('Sessão expirada.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        language: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Sessão inválida.');
    }

    return user;
  }
}
