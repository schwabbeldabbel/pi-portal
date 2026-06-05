// pv-cleanup-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DbCleanupService } from './db-cleanup-service';

@Injectable()
export class PvCleanupCronService {
  private readonly logger = new Logger(PvCleanupCronService.name);

  @Cron('0 10 0 * * *', {
    name: 'pv-daily-cleanup',
    timeZone: 'Europe/Berlin',
  })
  async handleDailyCleanup() {
    this.logger.log('Starting PV daily cleanup...');
    await DbCleanupService.cleanupPvData();
    this.logger.log('PV daily cleanup finished.');
  }
}