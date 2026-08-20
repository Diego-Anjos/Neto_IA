import { config } from 'dotenv';
config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissivo para evitar bloqueios no deploy
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`API escutando na porta ${port}`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error(
    error instanceof Error ? error.message : 'Falha ao iniciar o servidor',
    error instanceof Error ? error.stack : undefined,
  );
  process.exit(1);
});
