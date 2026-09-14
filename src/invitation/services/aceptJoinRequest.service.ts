import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from '../entity/invitation.entity';
import { DataSource, Repository } from 'typeorm';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { InvitationStatus } from '../enums/invitationStatus.enum';
import { MemberRole } from 'src/memberOrganization/enum/memberRole.enum';
import { AcceptJoinRequestResponseDto } from '../Dtos/response/acceptJoinRequestResponse.dto';

@Injectable()
export class AcceptJoinRequestService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(MembersOrganization)
    private readonly memberRepo: Repository<MembersOrganization>,
    private readonly dataSource: DataSource
  ) {}

  async acceptJoinRequest(
    organizationId: string,
    receiverUserId: string,
    admindId: string
  ) {
    const invitation = await this.invitationRepo.findOne({
      where: {
        organization: { id: organizationId },
        receiverUser: { id: receiverUserId },
        status: InvitationStatus.REQUESTED,
      },
      relations: { receiverUser: true },
    });

    if (!invitation) {
      throw new ConflictException('error in invitation');
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

    if (!admindId) {
      throw new ConflictException('adminUserId is required');
    }

   

    const verifyAdmin = await this.memberRepo.findOne({
      where: {
        organization: { id: organizationId },
        userMember: {id:admindId},
        role: MemberRole.ADMIN,
      },
    });

    if (!verifyAdmin) {
      throw new ConflictException('this user can not accept invitation');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.insert(MembersOrganization, {
        userMember: { id: receiverUserId },
        organization: { id: organizationId },
        role: MemberRole.MEMBER,
      });

      invitation.status = InvitationStatus.ACCEPTED;
      invitation['acceptedAt'] = new Date();
      await queryRunner.manager.save(invitation);

      await queryRunner.commitTransaction();
      return {
        id: invitation.id,
        organizationId: organizationId,
        organizationName: invitation.organization?.name,
        requestedByUserId: receiverUserId,
        requestedByUserName: invitation?.receiverUser?.name,
        status: invitation.status,
        createdAt: invitation.createdAt,
        acceptedAt: invitation['acceptedAt'],
      } as AcceptJoinRequestResponseDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
