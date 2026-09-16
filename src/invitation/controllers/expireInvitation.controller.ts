import { Controller, Post } from '@nestjs/common';
import { ExpireInvitationService } from '../services/expireInvitation.service';


//this is optional because we have the cron, but if we wanted do it manual
@Controller('invitations')
export class ExpireInvitationController {
  constructor(private readonly expireInvitationService: ExpireInvitationService) {}

  @Post('expire')
  async expireInvitationsManually() {
    await this.expireInvitationService.expireInvitations();
    return { message: 'Invitations expired successfully' };
  }
}
