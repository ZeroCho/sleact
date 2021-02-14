import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Workspaces } from './Workspaces';
import { Users } from './Users';

@Index('WorkspaceId', ['workspaceId'], {})
@Index('SenderId', ['senderId'], {})
@Index('ReceiverId', ['receiverId'], {})
@Entity('mentions', { schema: 'sleact' })
export class Mentions {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('enum', { name: 'category', enum: ['chat', 'dm', 'system'] })
  category: 'chat' | 'dm' | 'system';

  @Column('int', { name: 'chatId', nullable: true })
  chatId: number | null;

  @Column('datetime', { name: 'createdAt' })
  createdAt: Date;

  @Column('datetime', { name: 'updatedAt' })
  updatedAt: Date;

  @Column('int', { name: 'WorkspaceId', nullable: true })
  workspaceId: number | null;

  @Column('int', { name: 'SenderId', nullable: true })
  senderId: number | null;

  @Column('int', { name: 'ReceiverId', nullable: true })
  receiverId: number | null;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }])
  workspace: Workspaces;

  @ManyToOne(() => Users, (users) => users.mentions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SenderId', referencedColumnName: 'id' }])
  sender: Users;

  @ManyToOne(() => Users, (users) => users.mentions2, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ReceiverId', referencedColumnName: 'id' }])
  receiver: Users;
}
