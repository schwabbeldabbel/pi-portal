/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import "reflect-metadata";
import { AppDataSource } from './data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://10.101.4.122:4200',
      'http://10.101.1.31:4200',
    ],
  });
  const globalPrefix = 'api';
  Logger.log('Starting Database Connection');
  app.setGlobalPrefix(globalPrefix);
  try {
      await AppDataSource.initialize()
  } catch (error) {
      console.log(error)
  }
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
