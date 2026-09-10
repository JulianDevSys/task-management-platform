import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Invitation } from "../entity/invitation.entity";
import { Repository } from "typeorm";
import { Organization } from "src/organizations/entity/Organization.entity";
import { InvitationResponseDto } from "../Dtos/response/InvitationResponse.dto";
import { InvitationStatus } from "../enums/invitationStatus.enum";

@Injectable()
export class GetInvitationByOrganizationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
  ) {}

  async findInvitationByOrganization(organizationId: string) {
    const organization = await this.organizationRepo.findOne({
      where: { id: organizationId },
    });
    if (!organization) {
      throw new NotFoundException("This organization does not exist");
    }

    const invitations = await this.invitationRepo.find({
      where: { organization: { id: organizationId },  status: InvitationStatus.PENDING  },
      relations: { organization: true, receiverUser: true, sendInvitation: true },
    });

 if (!invitations || invitations.length === 0) {
    throw new NotFoundException('There are no invitations in this group');
  }
    return invitations.map(invitation => ({
    id: invitation.id,
    organizationName: invitation.organization.name,
    receiverUserId: invitation.receiverUser.id,
    receiverUserName: invitation.receiverUser.name,
    senderMemberId: invitation.sendInvitation.id,
    senderMemberName: invitation.sendInvitation.name,
    status: invitation.status,
    createdAt: invitation.createdAt,
    expiresAt: invitation.expiresAt,

  }));
  }
}
