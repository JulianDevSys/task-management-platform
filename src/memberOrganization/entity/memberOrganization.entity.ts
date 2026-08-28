import { Organization } from 'src/organizations/entity/Organization.entity';
import { User } from 'src/users/entity/User.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberRole } from '../enum/memberRole.enum';

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
}
