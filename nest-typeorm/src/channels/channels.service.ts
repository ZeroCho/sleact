import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Channels';

@Injectable()
export class ChannelsService {
  @InjectRepository(Channels) private channelsRepository: Repository<Channels>;

  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }

  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.channelMembers',
        'channelMembers',
        'channelMembers.userId = :myId',
        { myId },
      )
      .innerJoinAndSelect(
        'channels.workspace',
        'workspace',
        'workspace.url = :url',
        { url },
      )
      .getMany();
  }

  async getWorkspaceChannel(id: number, channelId: number) {
    return this.channelsRepository.findOne({
      where: {
        workspaceId: id,
        id: channelId,
      },
    });
  }

  async createWorkspaceChannels(id: number, name: string, myId: number) {
    const channel = new Channels();
    channel.name = name;
    channel.workspaceId = id;
    const channelMember = new ChannelMembers();
    channelMember.userId = myId;
    channel.channelMembers = [channelMember];
    return this.channelsRepository.save(channel);
  }
}
