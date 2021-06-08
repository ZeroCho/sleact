import { Workspaces } from './Workspaces';
import { Users } from './Users';
export declare class WorkspaceMembers {
    createdAt: Date;
    updatedAt: Date;
    WorkspaceId: number;
    UserId: number;
    loggedInAt: Date | null;
    Workspace: Workspaces;
    User: Users;
}
