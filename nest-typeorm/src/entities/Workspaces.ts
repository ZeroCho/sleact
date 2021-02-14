import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Channels } from './Channels';
import { DMs } from './Dms';
import { Mentions } from './Mentions';
import { WorkspaceMembers } from './Workspacemembers';
import { Users } from './Users';

@Index('name', ['name'], { unique: true })
@Index('url', ['url'], { unique: true })
@Index('OwnerId', ['ownerId'], {})
@Entity('workspaces', { schema: 'sleact' })
export class Workspaces {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', unique: true, length: 30 })
  name: string;

  @Column('varchar', { name: 'url', unique: true, length: 30 })
  url: string;

  @CreateDateColumn({ default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({
    onUpdate: 'NOW()',
    default: () => 'NOW()',
  })
  updatedAt: Date;

  @Column('datetime', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @Column('int', { name: 'OwnerId', nullable: true })
  ownerId: number | null;

  @OneToMany(() => Channels, (channels) => channels.workspace)
  channels: Channels[];

  @OneToMany(() => DMs, (dms) => dms.workspace)
  dms: DMs[];

  @OneToMany(() => Mentions, (mentions) => mentions.workspace)
  mentions: Mentions[];

  @OneToMany(
    () => WorkspaceMembers,
    (workspacemembers) => workspacemembers.workspace,
  )
  workspaceMembers: WorkspaceMembers[];

  @ManyToOne(() => Users, (users) => users.workspaces, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'OwnerId', referencedColumnName: 'id' }])
  owner: Users;
}
