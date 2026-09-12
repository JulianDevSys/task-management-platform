import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from '../entity/invitation.entity';
import { In, Repository } from 'typeorm';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { User } from 'src/users/entity/User.entity';
import { CreateInvitationDto } from '../Dtos/createInvitation.dto';
import { MemberRole } from 'src/memberOrganization/enum/memberRole.enum';
import { InvitationStatus } from '../enums/invitationStatus.enum';
import { InvitationResponseDto } from '../Dtos/response/InvitationResponse.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CreateInvitationService {
  logger = new Logger(CreateInvitationService.name);
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(MembersOrganization)
    private readonly memberRepo: Repository<MembersOrganization>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async createInvitation(
  senderUserId: string, 
  createInvitationDto: CreateInvitationDto
): Promise<InvitationResponseDto> {
  const { organizationId, receiverUserId } = createInvitationDto;

  const organization = await this.organizationRepo.findOne({
    where: { id: organizationId },
  });
  if (!organization) {
    throw new NotFoundException('this organization does not exist');
  }

  const receiverUser = await this.userRepo.findOne({
    where: { id: receiverUserId },
  });
  if (!receiverUser) {
    throw new NotFoundException('this user does not found');
  }

  
  const verifyAdmin = await this.memberRepo.findOne({
    where: {
      userMember: { id: senderUserId },
      organization: { id: organizationId },
      role: MemberRole.ADMIN,
    },
    relations: { userMember: true },
  });
  if (!verifyAdmin) {
    throw new ConflictException('this user can not send the invitation');
  }

  const verifyIsMember = await this.memberRepo.findOne({
    where: {
      userMember: { id: receiverUserId },
      organization: { id: organizationId },
    },
  });
  if (verifyIsMember) {
    throw new ConflictException('that user already belong to the group');
  }

  const existingInvitation = await this.invitationRepo.findOne({
    where: {
      organization: { id: organizationId },
      receiverUser: { id: receiverUserId },
      status: In([InvitationStatus.PENDING, InvitationStatus.REQUESTED]),
    },
  });
  if (existingInvitation) {
    throw new ConflictException(
      'There is already an invitation or request pending for this user in this organization'
    );
  }

  const expirationDays =
  this.configService.get<number>('INVITATION_EXPIRATION_DAYS') || 7;

  const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + expirationDays);

  const invitation = this.invitationRepo.create({
    organization,
    receiverUser,
    sendInvitation: { id: senderUserId } as User,
    expiresAt,
  });

  const savedInvitation = await this.invitationRepo.save(invitation);

  return {
    id: savedInvitation.id,
    organizationId: organization.id,
    organizationName: organization.name,
    receiverUserId: receiverUser.id,
    receiverUserName: receiverUser.name,
    senderMemberId: senderUserId,       
    senderMemberName: verifyAdmin.userMember.name, 
    status: savedInvitation.status,
    createdAt: savedInvitation.createdAt,
    expiresAt: savedInvitation.expiresAt,
  } as InvitationResponseDto;
}
}
