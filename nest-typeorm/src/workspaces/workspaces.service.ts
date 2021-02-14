import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channels } from '../entities/Channels';
import { Workspaces } from '../entities/Workspaces';

@Injectable()
export class WorkspacesService {
  @InjectRepository(Workspaces)
  private workspacesRepository: Repository<Workspaces>;
  @InjectRepository(Channels)
  private channelsRepository: Repository<Channels>;

  async findById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        workspaceMembers: [{ userId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const workspace = new Workspaces();
    workspace.name = name;
    workspace.url = url;
    workspace.ownerId = myId;
    return this.workspacesRepository.save(workspace);
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
    channel.channelMembers = [{ userId: myId }];
    return this.channelsRepository.save(channel);
  }
}
