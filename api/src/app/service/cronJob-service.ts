// pv-cleanup-cron.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DbCleanupService } from './db-cleanup-service';
import { WeatherService } from '../weather/weather.service';

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

@Injectable()
export class WeatherDataCleanupCronService {
  private readonly logger = new Logger(WeatherDataCleanupCronService.name);

  @Cron('0 10 0 * * *', {
    name: 'weather-data-cleanup',
    timeZone: 'Europe/Berlin',
  })
  async handleDailyCleanup() {
    this.logger.log('Starting weather data cleanup...');
    await DbCleanupService.cleanupWeatherData();
    this.logger.log('Weather data cleanup finished.');
  }
}

@Injectable()
export class WeatherCronService {
  private readonly logger = new Logger(WeatherCronService.name);

  constructor(private readonly weatherService: WeatherService) {}

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'weather-import-every-10-minutes',
    timeZone: 'Europe/Berlin',
  })
  async handleWeatherImport() {
    this.logger.log('Starting weather import...');
    await this.weatherService.fetchAndStoreCurrentWeather();
    this.logger.log('Weather import finished.');
  }
}