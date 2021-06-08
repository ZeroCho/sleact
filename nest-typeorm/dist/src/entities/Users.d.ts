import { ChannelChats } from './ChannelChats';
import { ChannelMembers } from './ChannelMembers';
import { Channels } from './Channels';
import { DMs } from './DMs';
import { Mentions } from './Mentions';
import { WorkspaceMembers } from './WorkspaceMembers';
import { Workspaces } from './Workspaces';
export declare class Users {
    id: number;
    email: string;
    nickname: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    ChannelChats: ChannelChats[];
    ChannelMembers: ChannelMembers[];
    DMs: DMs[];
    DMs2: DMs[];
    Mentions: Mentions[];
    Mentions2: Mentions[];
    WorkspaceMembers: WorkspaceMembers[];
    OwnedWorkspaces: Workspaces[];
    Workspaces: Workspaces[];
    Channels: Channels[];
}
