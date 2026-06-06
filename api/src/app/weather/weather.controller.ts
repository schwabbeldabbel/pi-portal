import { Controller, Get } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  getCurrentWeather() {
    return this.weatherService.getCurrentWeather();
  }

  @Get('forecast')
  getForecast() {
    return this.weatherService.getForecast();
  }
}