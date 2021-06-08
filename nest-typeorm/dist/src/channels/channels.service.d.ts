/// <reference types="multer" />
import { Repository } from 'typeorm';
import { ChannelChats } from '../entities/ChannelChats';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Channels } from '../entities/Channels';
import { Users } from '../entities/Users';
import { Workspaces } from '../entities/Workspaces';
import { EventsGateway } from '../events/events.gateway';
export declare class ChannelsService {
    private channelsRepository;
    private channelMembersRepository;
    private workspacesRepository;
    private channelChatsRepository;
    private usersRepository;
    private readonly eventsGateway;
    constructor(channelsRepository: Repository<Channels>, channelMembersRepository: Repository<ChannelMembers>, workspacesRepository: Repository<Workspaces>, channelChatsRepository: Repository<ChannelChats>, usersRepository: Repository<Users>, eventsGateway: EventsGateway);
    findById(id: number): Promise<Channels>;
    getWorkspaceChannels(url: string, myId: number): Promise<Channels[]>;
    getWorkspaceChannel(url: string, channelId: number): Promise<Channels>;
    createWorkspaceChannels(url: string, name: string, myId: number): Promise<void>;
    getWorkspaceChannelMembers(url: string, name: string): Promise<Users[]>;
    createWorkspaceChannelMembers(url: any, name: any, email: any): Promise<any>;
    getWorkspaceChannelChats(url: string, name: string, perPage: number, page: number): Promise<ChannelChats[]>;
    createWorkspaceChannelChats(url: string, name: string, content: string, myId: number): Promise<void>;
    createWorkspaceChannelImages(url: string, name: string, files: Express.Multer.File[], myId: number): Promise<void>;
    getChannelUnreadsCount(url: any, name: any, after: any): Promise<number>;
}
