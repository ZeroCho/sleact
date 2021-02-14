import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChannelChats } from './Channelchats';
import { ChannelMembers } from './Channelmembers';
import { DMs } from './Dms';
import { Mentions } from './Mentions';
import { WorkspaceMembers } from './Workspacemembers';
import { Workspaces } from './Workspaces';

@Index('email', ['email'], { unique: true })
@Entity('users', { schema: 'sleact' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'email', unique: true, length: 30 })
  email: string;

  @Column('varchar', { name: 'nickname', length: 30 })
  nickname: string;

  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @CreateDateColumn({ default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({
    onUpdate: 'NOW()',
    default: () => 'NOW()',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true, default: null })
  deletedAt: Date | null;

  @OneToMany(() => ChannelChats, (channelchats) => channelchats.user)
  channelChats: ChannelChats[];

  @OneToMany(() => ChannelMembers, (channelmembers) => channelmembers.user)
  channelMembers: ChannelMembers[];

  @OneToMany(() => DMs, (dms) => dms.sender)
  dms: DMs[];

  @OneToMany(() => DMs, (dms) => dms.receiver)
  dms2: DMs[];

  @OneToMany(() => Mentions, (mentions) => mentions.sender)
  mentions: Mentions[];

  @OneToMany(() => Mentions, (mentions) => mentions.receiver)
  mentions2: Mentions[];

  @OneToMany(
    () => WorkspaceMembers,
    (workspacemembers) => workspacemembers.user,
  )
  workspaceMembers: WorkspaceMembers[];

  @OneToMany(() => Workspaces, (workspaces) => workspaces.owner)
  workspaces: Workspaces[];
}
