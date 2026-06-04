import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebApiController } from './web-api/web-api.controller';
import { SensorApiController } from './sensor-api/sensor-api.controller';

@Module({
  imports: [],
  controllers: [AppController, WebApiController, SensorApiController],
  providers: [AppService],
})
export class AppModule {}
