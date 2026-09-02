import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatusTask } from "../enums/statusTask.enum";
import { PriorityTask } from "../enums/priorityTask.enum";
import { Organization } from "src/organizations/entity/Organization.entity";
import { MembersOrganization } from "src/memberOrganization/entity/memberOrganization.entity";

@Entity('tasks')
export class Tasks{

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({type: 'enum', enum: StatusTask, default: StatusTask.PENDING})
  status: StatusTask;

  @Column({type: 'enum', enum: PriorityTask, default: PriorityTask.LOW})
  priority: PriorityTask;

  @Column()
  dueDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.tasks, {
  onDelete: 'CASCADE',
})
@JoinColumn({ name: 'organizationId' })
organization: Organization;

@ManyToOne(() => MembersOrganization, (member) => member.taskAssigned, {
  onDelete: 'CASCADE',
  nullable: true,
})
@JoinColumn({ name: 'assignedToId' })
assignedTo: MembersOrganization | null;

@ManyToOne(() => MembersOrganization, (member) => member.taskAssignedBy, {
  onDelete: 'CASCADE',
})
@JoinColumn({ name: 'assignedById' })
assignedBy: MembersOrganization;


}