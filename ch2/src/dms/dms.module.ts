import { Module } from '@nestjs/common';
import { DmsService } from './dms.service';
import { DmsController } from './dms.controller';

@Module({
  providers: [DmsService],
  controllers: [DmsController]
})
export class DmsModule {}
