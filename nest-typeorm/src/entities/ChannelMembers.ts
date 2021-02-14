import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Channels } from './Channels';
import { Users } from './Users';

@Index('UserId', ['userId'], {})
@Entity('channelMembers', { schema: 'sleact', name: 'channelmembers' })
export class ChannelMembers {
  @Column('datetime', { name: 'createdAt' })
  createdAt: Date;

  @Column('datetime', { name: 'updatedAt' })
  updatedAt: Date;

  @Column('int', { primary: true, name: 'ChannelId' })
  channelId: number;

  @Column('int', { primary: true, name: 'UserId' })
  userId: number;

  @ManyToOne(() => Channels, (channels) => channels.channelMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ChannelId', referencedColumnName: 'id' }])
  channel: Channels;

  @ManyToOne(() => Users, (users) => users.channelMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: Users;
}
