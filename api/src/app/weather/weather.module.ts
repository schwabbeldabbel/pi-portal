import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { HttpModule } from '@nestjs/axios';
import { WeatherCronService } from '../service/cronJob-service';


@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherCronService],
  exports: [WeatherService],
})
export class WeatherModule {}