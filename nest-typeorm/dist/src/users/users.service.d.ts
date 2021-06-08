import { Repository } from 'typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
export declare class UsersService {
    private usersRepository;
    private workspaceMembersRepository;
    private channelMembersRepository;
    constructor(usersRepository: Repository<Users>, workspaceMembersRepository: Repository<WorkspaceMembers>, channelMembersRepository: Repository<ChannelMembers>);
    findByEmail(email: string): Promise<Users>;
    join(email: string, nickname: string, password: string): Promise<boolean>;
}
