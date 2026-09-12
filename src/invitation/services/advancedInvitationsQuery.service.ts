import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invitation } from '../entity/invitation.entity';
import { Repository } from 'typeorm';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { InvitationFiltersDto } from '../Dtos/invitationFilters.dto';

@Injectable()
export class AdvancedInvitationsQueryService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>
  ) {}

  async advancedInvitationsQuery(
    organizationId: string,
    filters: InvitationFiltersDto
  ) {
    const {
      createdFrom,
      createdTo,
      expiresFrom,
      expiresTo,
      limit,
      offset,
      orderBy,
      orderDirection,
      receiverUserId,
      senderUserId,
      status,
    } = filters;

    // 1️⃣ Validar que la organización exista
    const organization = await this.organizationRepo.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // 2️⃣ Construir QueryBuilder base
    const qb = this.invitationRepo
      .createQueryBuilder('invitation')
      .leftJoinAndSelect('invitation.receiverUser', 'receiver')
      .leftJoinAndSelect('invitation.sendInvitation', 'sender')
      .where('invitation.organizationId = :organizationId', { organizationId });

    // 3️⃣ Filtros opcionales
    if (status) {
      qb.andWhere('invitation.status = :status', { status });
    }

    if (createdFrom && createdTo) {
      qb.andWhere('invitation.createdAt BETWEEN :from AND :to', {
        from: createdFrom,
        to: createdTo,
      });
    }

    if (expiresFrom && expiresTo) {
      qb.andWhere('invitation.expiresAt BETWEEN :expFrom AND :expTo', {
        expFrom: expiresFrom,
        expTo: expiresTo,
      });
    }

    if (receiverUserId) {
      qb.andWhere('receiver.id = :receiverUserId', { receiverUserId });
    }

    if (senderUserId) {
      qb.andWhere('sender.id = :senderUserId', { senderUserId });
    }

    // 4️⃣ Orden dinámico
    if (orderBy) {
      qb.orderBy(`invitation.${orderBy}`, orderDirection || 'DESC');
    } else {
      qb.orderBy('invitation.createdAt', 'DESC');
    }

    // 5️⃣ Paginación
    qb.take(limit || 20);
    qb.skip(offset || 0);

    // 6️⃣ Ejecutar consulta
    const invitations = await qb.getMany();

    if (!invitations || invitations.length === 0) {
      throw new NotFoundException('No invitations found');
    }

    // 7️⃣ Mapear respuesta limpia y segura
    return invitations.map((invitation) => {
      const type: 'ADMIN_TO_USER' | 'USER_TO_ORG' =
        invitation.receiverUser && invitation.sendInvitation
          ? 'ADMIN_TO_USER'
          : 'USER_TO_ORG';

      return {
        id: invitation.id,
        organizationName: organization.name,
        receiverUserId: invitation.receiverUser?.id || null,
        receiverUserName: invitation.receiverUser?.name || null,
        senderMemberId: invitation.sendInvitation?.id || null,
        senderMemberName: invitation.sendInvitation?.name || null,
        status: invitation.status,
        createdAt: invitation.createdAt,
        expiresAt: invitation.expiresAt,
        type, // nuevo campo para distinguir el origen
      };
    });
  }
}
