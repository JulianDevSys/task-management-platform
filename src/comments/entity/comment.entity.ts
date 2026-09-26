import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tasks } from 'src/task/entity/task.entity';
import { User } from 'src/users/entity/User.entity';

@Entity({ name: 'comments' })
@Index(['task', 'createdAt'])
@Index(['user', 'createdAt'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Tasks, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Tasks;
}
