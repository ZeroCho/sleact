import { Workspaces } from './Workspaces';
import { Users } from './Users';
export declare class Mentions {
    id: number;
    type: 'chat' | 'dm' | 'system';
    ChatId: number | null;
    createdAt: Date;
    updatedAt: Date;
    WorkspaceId: number | null;
    SenderId: number | null;
    ReceiverId: number | null;
    Workspace: Workspaces;
    Sender: Users;
    Receiver: Users;
}
