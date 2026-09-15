import { Controller, Param, Post, Body } from '@nestjs/common';
import { RejectInvitationService } from '../services/rejectInvitation.service';
import { RejectInvitationResponseDto } from '../Dtos/response/rejectInvitationResponse.dto';

@Controller('invitations')
export class RejectInvitationController {
  constructor(
    private readonly rejectInvitationService: RejectInvitationService
  ) {}

  @Post(':id/reject')
  async rejectInvitation(
    @Param('id') invitationId: string,
    @Body('receiverUserId') receiverUserId: string
  ): Promise<RejectInvitationResponseDto> {
    return await this.rejectInvitationService.rejectInvitation(
      invitationId,
      receiverUserId
    );
  }
}
