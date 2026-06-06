import { Test, TestingModule } from '@nestjs/testing';
import { SensorApiController } from './sensor-api.controller';

describe('SensorApiController', () => {
  let controller: SensorApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorApiController],
    }).compile();

    controller = module.get<SensorApiController>(SensorApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
