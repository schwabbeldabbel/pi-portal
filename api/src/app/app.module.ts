import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebApiController } from './web-api/web-api.controller';
import { SensorApiController } from './sensor-api/sensor-api.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { PvCleanupCronService } from './service/cronJob-service';


@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController, WebApiController, SensorApiController],
  providers: [AppService, PvCleanupCronService],
})
export class AppModule {}
