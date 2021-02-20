import { Module } from '@nestjs/common';
import { DMsController } from './dms.controller';
import { DMsService } from './dms.service';

@Module({
  controllers: [DMsController],
  providers: [DMsService],
})
export class DMsModule {}
