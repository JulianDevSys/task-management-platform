import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Invitation } from '../entity/invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { User } from 'src/users/entity/User.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { InvitationStatus } from '../enums/invitationStatus.enum';

@Injectable()
export class CreateJoinRequestService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(MembersOrganization)
    private readonly memberRepo: Repository<MembersOrganization>
  ) {}

  async createJoinRequest(organizationId: string, userId: string) {
    const organization = await this.organizationRepo.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new NotFoundException('the organization does not exist');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('the user does not exist');
    }

    const member = await this.memberRepo.findOne({
      where: {
        organization: { id: organizationId },
        userMember: { id: userId },
      },
    });

    if (member) {
      throw new ConflictException('the user already exist in the group');
    }

    const invitation = await this.invitationRepo.findOne({
      where: {
        organization: { id: organizationId },
        status: In([InvitationStatus.PENDING, InvitationStatus.REQUESTED]),
      },
    });

    if (invitation) {
      throw new ConflictException('the invitation exist');
    }

    const joinRequest = this.invitationRepo.create({
      organization,
      receiverUser: user,
      status: InvitationStatus.REQUESTED,
      createdAt: new Date(),
    });

    const savedRequest = await this.invitationRepo.save(joinRequest);

    return {
      id: savedRequest.id,
      organizationId: organization.id,
      organizationName: organization.name,
      requestedByUserId: user.id,
      requestedByUserName: user.name,
      status: savedRequest.status,
      createdAt: savedRequest.createdAt,
    };
  }
}
