import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SystemStatus } from 'shared-data';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getStatus')
  getStatus(): SystemStatus {
    return {
      name: 'Pi-Portal API',
      online: true,
      source: 'NestJS API',
      timestamp: new Date().toISOString(),
    }
  }
}
