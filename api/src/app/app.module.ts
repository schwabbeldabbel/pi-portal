import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './app.service';
import { WebApiController } from './controller/web-api/web-api.controller';
import { SensorApiController } from './controller/sensor-api/sensor-api.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { PvCleanupCronService } from './service/cronJob-service';


@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController, WebApiController, SensorApiController],
  providers: [AppService, PvCleanupCronService],
})
export class AppModule {}
