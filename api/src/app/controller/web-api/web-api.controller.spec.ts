import { Test, TestingModule } from '@nestjs/testing';
import { WebApiController } from './web-api.controller';

describe('WebApiController', () => {
  let controller: WebApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebApiController],
    }).compile();

    controller = module.get<WebApiController>(WebApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
