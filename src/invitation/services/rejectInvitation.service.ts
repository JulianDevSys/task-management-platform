import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from '../entity/invitation.entity';
import { In, Repository } from 'typeorm';
import { InvitationStatus } from '../enums/invitationStatus.enum';
import { RejectInvitationResponseDto } from '../Dtos/response/rejectInvitationResponse.dto';

@Injectable()
export class RejectInvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>
  ) {}

  async rejectInvitation(
    invitationId: string,
    receiverUserId: string
  ): Promise<RejectInvitationResponseDto> {
    const invitation = await this.invitationRepo.findOne({
      where: {
        id: invitationId,
        status: In([InvitationStatus.PENDING, InvitationStatus.REQUESTED]),
      },
      relations: { receiverUser: true, organization: true },
    });
    if (!invitation) {
      throw new NotFoundException('the invitation does not exist');
    }

    if (
      invitation.status === InvitationStatus.ACCEPTED ||
      invitation.status === InvitationStatus.REJECTED ||
      invitation.status === InvitationStatus.EXPIRED
    ) {
      throw new ConflictException('The invitation is invalid');
    }

    if (invitation.receiverUser.id != receiverUserId) {
      throw new ConflictException('eror in the invitaiton');
    }

    invitation.status = InvitationStatus.REJECTED;

    await this.invitationRepo.save(invitation);

    return {
      id: invitation.id,
      organizationId: invitation.organization.id,
      receiverUserId: invitation.receiverUser.id,
      status: invitation.status,
      createdAt: invitation.createdAt,
      rejectedAt: new Date(),
    };
  }
}
