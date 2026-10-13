import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from '../entity/invitation.entity';
import { DataSource, Repository } from 'typeorm';
import { InvitationStatus } from '../enums/invitationStatus.enum';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { MemberRole } from 'src/memberOrganization/enum/memberRole.enum';
import { RejectJoinRequestResponseDto } from '../Dtos/response/rejectJoinRequestResponse.dto';
import { CreateNotificationService } from 'src/notifications/services/createNotification.service';
import { NotificationType } from 'src/notifications/enums/notification-type.enum';

@Injectable()
export class RejectJoinRequestService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(MembersOrganization)
    private readonly memberRepo: Repository<MembersOrganization>,
    private readonly dataSource: DataSource,
    private readonly createNotificationService: CreateNotificationService,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      invitation.status = InvitationStatus.REJECTED;
      invitation['rejectedAt'] = new Date();

      await queryRunner.manager.save(invitation);

      await this.createNotificationService.createNotification(
        {
          userId: receiverUserId,
          type: NotificationType.JOIN_REQUEST_REJECTED,
          message: `Tu solicitud para unirte a la organización "${invitation.organization?.name ?? 'la organización'}" fue rechazada.`,
        },
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();

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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
