import { Users } from './Users';
import { Channels } from './Channels';
export declare class ChannelChats {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    UserId: number | null;
    ChannelId: number | null;
    User: Users;
    Channel: Channels;
}
