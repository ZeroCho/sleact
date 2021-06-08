import { Users } from '../entities/Users';
import { Workspaces } from '../entities/Workspaces';
export declare class WorkspacesService {
    private workspacesRepository;
    private channelsRepository;
    private workspaceMembersRepository;
    private channelMembersRepository;
    private usersRepository;
    findById(id: number): Promise<Workspaces>;
    findMyWorkspaces(myId: number): Promise<Workspaces[]>;
    createWorkspace(name: string, url: string, myId: number): Promise<void>;
    getWorkspaceMembers(url: string): Promise<Users[]>;
    createWorkspaceMembers(url: any, email: any): Promise<any>;
    getWorkspaceMember(url: string, id: number): Promise<Users>;
}
