import { ChannelChats } from './ChannelChats';
import { ChannelMembers } from './ChannelMembers';
import { Users } from './Users';
import { Workspaces } from './Workspaces';
export declare class Channels {
    id: number;
    name: string;
    private: boolean | null;
    createdAt: Date;
    updatedAt: Date;
    WorkspaceId: number | null;
    ChannelChats: ChannelChats[];
    ChannelMembers: ChannelMembers[];
    Members: Users[];
    Workspace: Workspaces;
}
