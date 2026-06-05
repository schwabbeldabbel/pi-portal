import { Body, Controller, Post } from '@nestjs/common';
import { PvReadingEntity } from '../../entities/PvEntity';
import { AppDataSource } from '../../data-source';

@Controller('sensor')
export class SensorApiController {

    @Post('write/solar/values')
    async setPvData(@Body() data: PvReadingEntity) {
        try {
            console.log('Received PV Data');

            const pvRepository = AppDataSource.getRepository(PvReadingEntity);
            const pvEntry = pvRepository.create(data);
            const savedEntry = await pvRepository.save(pvEntry);

            console.log('PV data saved successfully');

            return {
                ok: true,
                id: savedEntry.id,
                receivedAt: new Date().toISOString(),
            };
        } catch (error) {
            console.error('Failed to save PV data', error);

            return {
                ok: false,
                error: 'Failed to save PV data',
                receivedAt: new Date().toISOString(),
            };
        }
    }
}

