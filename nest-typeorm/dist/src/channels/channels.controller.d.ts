/// <reference types="multer" />
import { Users } from '../entities/Users';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelsService } from './channels.service';
export declare class ChannelsController {
    private channelsService;
    constructor(channelsService: ChannelsService);
    getWorkspaceChannels(url: any, user: Users): Promise<import("../entities/Channels").Channels[]>;
    getWorkspaceChannel(url: any, name: any): Promise<import("../entities/Channels").Channels>;
    createWorkspaceChannels(url: any, body: CreateChannelDto, user: Users): Promise<void>;
    getWorkspaceChannelMembers(url: string, name: string): Promise<Users[]>;
    createWorkspaceMembers(url: string, name: string, email: any): Promise<any>;
    getWorkspaceChannelChats(url: any, name: any, perPage: number, page: number): Promise<import("../entities/ChannelChats").ChannelChats[]>;
    createWorkspaceChannelChats(url: any, name: any, content: any, user: Users): Promise<void>;
    createWorkspaceChannelImages(url: any, name: any, files: Express.Multer.File[], user: Users): Promise<void>;
    getUnreads(url: any, name: any, after: number): Promise<number>;
}
