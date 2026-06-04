import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SystemStatus, PvData } from 'shared-data';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('read/getStatus')
  getStatus(): SystemStatus {
    return {
      name: 'Pi-Portal API',
      online: true,
      source: 'NestJS API',
      timestamp: new Date().toISOString(),
    }
  }

  @Get('read/solar/values')
  getPvData(): PvData {
    return {
      voltage: 0,
      current: 0,
      power: 0,
      shuntVoltageMv: 0,
      source: 'NestJS API',
      measuredAt: new Date().toISOString(),
    }
  }

  @Post('write/solar/values')
  setPvData(@Body() data: PvData) {
    console.log('Received PV Data:', data);
    return {
      ok: true,
      receivedAt: new Date().toISOString(),
    };
  }
}
