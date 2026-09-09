import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvitationStatus } from '../enums/invitationStatus.dto';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { User } from 'src/users/entity/User.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';

@Entity({ name: 'invitations' })
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @CreateDateColumn({nullable:true})
  createdAt: Date;

  @UpdateDateColumn({nullable:true})
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.invitations)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => User, (user) => user.receivedInvitations)
  @JoinColumn({ name: 'receiverUserId' })
  receiverUser: User;


  @ManyToOne(() => User, (user) => user.sendInvitations)
  @JoinColumn({ name: 'sendInvitationId' })
  sendInvitation: User;

/*   @ManyToOne(()=>MembersOrganization, (member)=> member.sendInvitation)
  @JoinColumn({ name: 'sendInvitationId' })
  sendInvitation: MembersOrganization; */
}
