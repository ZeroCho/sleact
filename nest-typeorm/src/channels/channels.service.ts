import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelChats } from '../entities/ChannelChats';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Channels';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { Workspaces } from '../entities/Workspaces';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
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
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    const channel = new Channels();
    channel.name = name;
    channel.workspaceId = workspace.id;
    const channelReturned = await this.channelsRepository.save(channel);
    const channelMember = new ChannelMembers();
    channelMember.userId = myId;
    channelMember.channelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.workspaces', 'workspaces', 'workspaces.url = :url', {
        url,
      })
      .innerJoin('workspaces.channels', 'channels', 'channels.name = :name', {
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
      .innerJoin('channelChats.channel', 'channel', 'channel.name = :name', {
        name,
      })
      .innerJoin('channel.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .innerJoinAndSelect('channelChats.user', 'user')
      .orderBy('createdAt', 'DESC')
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  async createWorkspaceChannelChats(
    url: string,
    name: string,
    content: string,
    myId: number,
  ) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    const chats = new ChannelChats();
    chats.content = content;
    chats.userId = myId;
    chats.channelId = channel.id;
    return this.channelChatsRepository.save(chats);
  }
}
