import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
export declare class AuthService {
    private usersRepository;
    constructor(usersRepository: Repository<Users>);
    validateUser(email: string, password: string): Promise<{
        id: number;
        email: string;
        nickname: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        ChannelChats: import("../entities/ChannelChats").ChannelChats[];
        ChannelMembers: import("../entities/ChannelMembers").ChannelMembers[];
        DMs: import("../entities/DMs").DMs[];
        DMs2: import("../entities/DMs").DMs[];
        Mentions: import("../entities/Mentions").Mentions[];
        Mentions2: import("../entities/Mentions").Mentions[];
        WorkspaceMembers: import("../entities/WorkspaceMembers").WorkspaceMembers[];
        OwnedWorkspaces: import("../entities/Workspaces").Workspaces[];
        Workspaces: import("../entities/Workspaces").Workspaces[];
        Channels: import("../entities/Channels").Channels[];
    }>;
}
