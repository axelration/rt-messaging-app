import { Test, TestingModule } from '@nestjs/testing';
import { AuthTestController } from './auth.test.controller';

describe('AuthTestController', () => {
  let controller: AuthTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthTestController],
    }).compile();

    controller = module.get<AuthTestController>(AuthTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
