import { Channels } from './Channels';
import { DMs } from './DMs';
import { Mentions } from './Mentions';
import { WorkspaceMembers } from './WorkspaceMembers';
import { Users } from './Users';
export declare class Workspaces {
    id: number;
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    OwnerId: number | null;
    Channels: Channels[];
    DMs: DMs[];
    Mentions: Mentions[];
    WorkspaceMembers: WorkspaceMembers[];
    Owner: Users;
    Members: Users[];
}
