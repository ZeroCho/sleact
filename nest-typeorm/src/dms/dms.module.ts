import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DMs } from '../entities/DMs';
import { Users } from '../entities/Users';
import { Workspaces } from '../entities/Workspaces';
import { DMsController } from './dms.controller';
import { DMsService } from './dms.service';

@Module({
  imports: [TypeOrmModule.forFeature([DMs, Users, Workspaces])],
  controllers: [DMsController],
  providers: [DMsService],
})
export class DMsModule {}
