import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Workspaces } from './Workspaces';
import { Users } from './Users';

@Index('UserId', ['userId'], {})
@Entity('workspaceMembers', { schema: 'sleact', name: 'workspacemembers' })
export class WorkspaceMembers {
  @CreateDateColumn({ default: () => 'NOW()' })
  createdAt: Date;

  @UpdateDateColumn({
    onUpdate: 'NOW()',
    default: () => 'NOW()',
  })
  updatedAt: Date;

  @Column('int', { primary: true, name: 'WorkspaceId' })
  workspaceId: number;

  @Column('int', { primary: true, name: 'UserId' })
  userId: number;

  @Column('datetime', { name: 'loggedInAt', nullable: true })
  loggedInAt: Date | null;

  @ManyToOne(() => Workspaces, (workspaces) => workspaces.workspaceMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'WorkspaceId', referencedColumnName: 'id' }])
  workspace: Workspaces;

  @ManyToOne(() => Users, (users) => users.workspaceMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  user: Users;
}
