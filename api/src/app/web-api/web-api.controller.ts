import { Controller, Get, Logger } from '@nestjs/common';
import { PvData } from 'shared-data';
import { AppDataSource } from '../../data-source';
import { PvReadingEntity } from '../../entities/PvEntity';

@Controller('web')
export class WebApiController {

    @Get('get/solar/values')
    getPvData(): PvReadingEntity[] {
        Logger.log('Fetching PV Data');
        
        const pvRepository = AppDataSource.getRepository(PvReadingEntity);
        if(!pvRepository) {
            Logger.error('Failed to get PV data repository');
            Logger.log('Failed to get PV data repository');
        }else {
            const pvData = pvRepository.find();
            if(!pvData) {
                Logger.error('Failed to fetch PV data');
                Logger.log('Failed to fetch PV data');
            }else{
                pvData.then(data =>  {
                    Logger.log(`Fetched ${data.length} PV data entries`);
                    return data;
                });
            }
        }
        return [];
    }
}
