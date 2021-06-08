import { Workspaces } from './Workspaces';
import { Users } from './Users';
export declare class DMs {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    WorkspaceId: number | null;
    SenderId: number | null;
    ReceiverId: number | null;
    Workspace: Workspaces;
    Sender: Users;
    Receiver: Users;
}
