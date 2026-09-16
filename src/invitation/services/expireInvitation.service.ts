import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Invitation } from '../entity/invitation.entity';
import { InvitationStatus } from '../enums/invitationStatus.enum';

@Injectable()
export class ExpireInvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    private readonly configService: ConfigService, // 👈 ahora puedes leer .env
  ) {}

  @Cron('0 0 * * *') // todos los días a medianoche
  async expireInvitations() {
    const expirationDays =
      this.configService.get<number>('INVITATION_EXPIRATION_DAYS') || 7;

    const invitations = await this.invitationRepo.find({
      where: { status: In([InvitationStatus.PENDING, InvitationStatus.REQUESTED]) },
    });

    const now = new Date();
    let expiredCount = 0;

    for (const invitation of invitations) {
      const expirationDate = new Date(invitation.createdAt);
      expirationDate.setDate(expirationDate.getDate() + expirationDays);

      if (now > expirationDate) {
        invitation.status = InvitationStatus.EXPIRED;
        invitation['expiredAt'] = now;
        await this.invitationRepo.save(invitation);
        expiredCount++;
      }
    }

    console.log(`✅ Expired ${expiredCount} invitations at ${now.toISOString()}`);
  }
}
