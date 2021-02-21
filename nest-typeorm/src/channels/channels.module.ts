import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelChats } from '../entities/ChannelChats';
import { Channels } from '../entities/Channels';
import { Users } from '../entities/Users';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Channels, ChannelChats, Users])],
  providers: [ChannelsService],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
