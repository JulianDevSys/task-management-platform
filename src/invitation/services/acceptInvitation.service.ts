import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from '../entity/invitation.entity';
import { DataSource, In, Repository } from 'typeorm';
import { InvitationStatus } from '../enums/invitationStatus.enum';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { MemberRole } from 'src/memberOrganization/enum/memberRole.enum';
import { AcceptInvitationResponseDto } from '../Dtos/response/acceptInvitationResponse.dto';

@Injectable()
export class AcceptInvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    private readonly dataSource: DataSource
  ) {}

  async acceptInvitation(
    IdInvitation: string,
    receiverUserId: string,
    organizationId: string
  ) : Promise<AcceptInvitationResponseDto>{
    const invitation = await this.invitationRepo.findOne({
      where: {
        id: IdInvitation,
        organization: { id: organizationId },
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
      throw new ConflictException('eror in the invitaiton ');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Crear miembro en la organización
      await queryRunner.manager.insert(MembersOrganization, {
        userMember: { id: receiverUserId },
        organization: { id: organizationId },
        role: MemberRole.MEMBER,
      });

      invitation.status = InvitationStatus.ACCEPTED;
      await queryRunner.manager.save(invitation);

      await queryRunner.commitTransaction();
      return {
        id: invitation.id,
        organizationId: organizationId,
        receiverUserId: receiverUserId,
        status: invitation.status,
        createdAt: invitation.createdAt,
        acceptedAt: new Date(),
      };
    } catch (error) {
      // Si algo falla, revertir
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar conexión
      await queryRunner.release();
    }
  }
}
