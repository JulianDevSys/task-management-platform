import { Organization } from 'src/organizations/entity/Organization.entity';
import { User } from 'src/users/entity/User.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberRole } from '../enum/memberRole.enum';
import { Tasks } from 'src/task/entity/task.entity';
import { Invitation } from 'src/invitation/entity/invitation.entity';

@Entity('member_organization')
export class MembersOrganization {
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({name: 'role_member', type: 'enum',  enum: MemberRole, default: MemberRole.MEMBER})
  role:MemberRole;

  @ManyToOne(() => User, (userMember) => userMember.memberShip)
  userMember: User;

  @ManyToOne(
    () => Organization,
    (organization) => organization.Membership
  )
  organization: Organization;

  @OneToMany(() => Tasks, (task) => task.assignedTo)
  taskAssigned: Tasks[];

  @OneToMany(() => Tasks, (task) => task.assignedBy)
  taskAssignedBy: Tasks[];

/*   @OneToMany(()=>Invitation, (invitation)=> invitation.sendInvitation)
  sendInvitation: Invitation[] */
}
