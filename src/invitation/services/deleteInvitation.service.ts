import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from '../entity/invitation.entity';
import { Repository } from 'typeorm';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { MemberRole } from 'src/memberOrganization/enum/memberRole.enum';
import { InvitationStatus } from '../enums/invitationStatus.enum';

@Injectable()
export class DeleteInvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(MembersOrganization)
    private readonly memberRepo: Repository<MembersOrganization>
  ) {}

  async deleteInvitation( invitationId: string, adminId: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: invitationId },
      relations: { organization: true },
    });

    if (!invitation) throw new NotFoundException('Invitation not found');

    const admin = await this.memberRepo.findOne({
      where: {
        userMember: { id: adminId },
        organization: { id: invitation.organization.id },
        role: MemberRole.ADMIN,
      },
    });
    if (!admin)
      throw new ConflictException('Only admins can delete invitations');

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new ConflictException('Only pending invitations can be deleted');
    }

    await this.invitationRepo.remove(invitation);
  }
}
