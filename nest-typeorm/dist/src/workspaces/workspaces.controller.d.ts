import { Users } from '../entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspacesService } from './workspaces.service';
export declare class WorkspacesController {
    private workspacesService;
    constructor(workspacesService: WorkspacesService);
    getMyWorkspaces(user: Users): Promise<import("../entities/Workspaces").Workspaces[]>;
    createWorkspace(user: Users, body: CreateWorkspaceDto): Promise<void>;
    getWorkspaceMembers(url: string): Promise<Users[]>;
    createWorkspaceMembers(url: string, email: any): Promise<any>;
    getWorkspaceMember(url: string, id: number): Promise<Users>;
    getWorkspaceUser(url: string, id: number): Promise<Users>;
}
