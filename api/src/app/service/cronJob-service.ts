import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WeatherService } from '../weather/weather.service';

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
    await this.weatherService.fetchAndStoreRecentWeather();
    this.logger.log('Weather import finished.');
  }
}
