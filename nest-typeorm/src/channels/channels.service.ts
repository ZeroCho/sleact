import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelChats } from '../entities/ChannelChats';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Channels';
import { Users } from '../entities/Users';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

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

  async getWorkspaceChannel(url: string, channelId: number) {
    return this.channelsRepository.findOne({
      where: {
        // workspaceId: id,
        id: channelId,
      },
    });
  }

  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const channel = new Channels();
    channel.name = name;
    // channel.workspaceId = id;
    const channelMember = new ChannelMembers();
    channelMember.userId = myId;
    channel.channelMembers = [channelMember];
    return this.channelsRepository.save(channel);
  }

  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.workspaces', 'workspaces', 'workspaces.url = :url', {
        url,
      })
      .leftJoin('workspaces.channels', 'channels', 'channels.name = :name', {
        name,
      })
      .getMany();
  }

  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return this.channelChatsRepository
      .createQueryBuilder('channelChats')
      .leftJoin('channelChats.channel', 'channel', 'channel.name = :name', {
        name,
      })
      .leftJoin('channel.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return this.channelChatsRepository
      .createQueryBuilder('channelChats')
      .leftJoin('channelChats.channel', 'channel', 'channel.name = :name', {
        name,
      })
      .leftJoin('channel.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }
}
