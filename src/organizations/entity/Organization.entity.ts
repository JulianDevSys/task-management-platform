import { Invitation } from 'src/invitation/entity/invitation.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { Tasks } from 'src/task/entity/task.entity';
import { User } from 'src/users/entity/User.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  description:string;

  @Column({ name: 'logo_key', type: 'varchar', length: 500, nullable: true })
  logoKey: string | null;

  @Column({ name: 'logo_mime_type', type: 'varchar', length: 120, nullable: true })
  logoMimeType: string | null;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => User, (creator) => creator.organizations)
  creator: User;
  
  @OneToMany(
    () => MembersOrganization,
    (Membership ) => Membership.organization, {cascade: true, onDelete: 'CASCADE'}// si borro la organization automaticamente se borran los miembros de la organizacion
  )
  Membership : MembersOrganization[];

  @OneToMany(() => Tasks, (task) => task.organization,)
  tasks: Tasks[]; 

  @OneToMany(()=> Invitation,(invitation)=> invitation.organization)
  invitations: Invitation[]
}
