import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import 'reflect-metadata';
import { AppDataSource } from './data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.log(error);
  }

  const port = Number(process.env.PORT || 3000);
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 API läuft lokal auf: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`🌐 API im Netzwerk auf: http://<PI-IP>:${port}/${globalPrefix}`);
}

bootstrap();