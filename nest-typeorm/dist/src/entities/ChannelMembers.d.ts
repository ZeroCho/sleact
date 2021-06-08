import { Channels } from './Channels';
import { Users } from './Users';
export declare class ChannelMembers {
    createdAt: Date;
    updatedAt: Date;
    ChannelId: number;
    UserId: number;
    Channel: Channels;
    User: Users;
}
