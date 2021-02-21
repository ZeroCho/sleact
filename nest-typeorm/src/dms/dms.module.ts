import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMs } from '../entities/DMs';
import { Users } from '../entities/Users';
import { DMsController } from './dms.controller';
import { DMsService } from './dms.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMs, Users])],
  controllers: [DMsController],
  providers: [DMsService],
})
export class DMsModule {}
