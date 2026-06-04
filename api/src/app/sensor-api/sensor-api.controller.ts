import { Body, Controller, Post } from '@nestjs/common';
import { PvReadingEntity } from '../../entities/PvEntity';

@Controller('sensor')
export class SensorApiController {

    @Post('write/solar/values')
    setPvData(@Body() data: PvReadingEntity) {

        console.log('Received PV Data');
        return {
            ok: true,
            receivedAt: new Date().toISOString(),
        };
    }
}

