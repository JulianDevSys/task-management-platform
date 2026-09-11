import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from '../entity/invitation.entity';
import { Repository } from 'typeorm';
import { InvitationStatus } from '../enums/invitationStatus.enum';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { MemberRole } from 'src/memberOrganization/enum/memberRole.enum';
import { RejectJoinRequestResponseDto } from '../Dtos/response/rejectJoinRequestResponse.dto';


@Injectable()
export class RejectJoinRequestService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(MembersOrganization)
    private readonly memberRepo: Repository<MembersOrganization>,
  ) {}

  async rejectJoinRequest(
    organizationId: string,
    receiverUserId: string,
    adminId: string
  ): Promise<RejectJoinRequestResponseDto> {
    const invitation = await this.invitationRepo.findOne({
      where: {
        organization: { id: organizationId },
        receiverUser: { id: receiverUserId },
        status: InvitationStatus.REQUESTED,
      },
      relations: { receiverUser: true, organization: true },
    });

    if (!invitation) {
      throw new ConflictException('Invitation not found or invalid');
    }

    const verifyAdmin = await this.memberRepo.findOne({
      where: {
        organization: { id: organizationId },
        userMember: { id: adminId },
        role: MemberRole.ADMIN,
      },
    });

    if (!verifyAdmin) {
      throw new ConflictException('Only admins can reject requests');
    }

    invitation.status = InvitationStatus.REJECTED;
    invitation['rejectedAt'] = new Date();

    await this.invitationRepo.save(invitation);

    return {
      id: invitation.id,
      organizationId: organizationId,
      organizationName: invitation.organization?.name,
      requestedByUserId: receiverUserId,
      requestedByUserName: invitation.receiverUser?.name,
      status: invitation.status,
      createdAt: invitation.createdAt,
      rejectedAt: invitation['rejectedAt'],
    } as RejectJoinRequestResponseDto;
  }
}
