import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { Invitation } from 'src/invitation/entity/invitation.entity';
import { RefreshToken } from 'src/auth/entity/auth.entity';
import { Comment } from 'src/comments/entity/comment.entity';
import { Notification } from 'src/notifications/entity/notification.entity';


@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl: string | null;

  @Column({ name: 'profile_image_key', type: 'varchar', length: 500, nullable: true })
  profileImageKey: string | null;

  @Column({ name: 'profile_image_mime_type', type: 'varchar', length: 120, nullable: true })
  profileImageMimeType: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ select: false }) // evitamos devolverla
  password:string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Organization, (organizations) => organizations.creator)
  organizations: Organization[];

  @OneToMany(() => MembersOrganization, (memberShip) => memberShip.userMember)
  memberShip: MembersOrganization[];

  @OneToMany(()=> Invitation, (invitation)=> invitation.receiverUser)
  receivedInvitations: Invitation[]

  @OneToMany(()=> Invitation, (invitation)=> invitation.sendInvitation)
  sendInvitations: Invitation[]

  @OneToMany(()=> RefreshToken, (token)=>token.user)
  refreshTokens: RefreshToken[]

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
