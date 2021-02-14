import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Channels } from './Channels';
import { Users } from './Users';

@Index('UserId', ['userId'], {})
@Entity('channelMembers', { schema: 'sleact', name: 'channelmembers' })
export class ChannelMembers {
  @CreateDateColumn({ default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({
    onUpdate: 'NOW()',
    default: () => 'NOW()',
  })
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
