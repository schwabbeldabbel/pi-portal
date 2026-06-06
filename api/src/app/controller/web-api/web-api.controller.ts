import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { FlatWidgetData } from 'shared-data';
import { ReadDataService } from '../../service/read-data-service';

@Controller('web')
export class WebApiController {

    constructor(
        @Inject(ReadDataService) private readonly readDataService: ReadDataService,
    ) {}

    @Get('getWidgetData')
    async getWidgetData(): Promise<FlatWidgetData[]> {
        Logger.log('Received request for widget data');
        const data = await this.readDataService.readData();
        Logger.log(`Fetched ${data.length} widget data entries`);
        return data;
    }
}
