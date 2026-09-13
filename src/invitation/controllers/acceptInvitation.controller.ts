import { Controller, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AcceptInvitationService } from '../services/acceptInvitation.service';
import { AcceptInvitationResponseDto } from '../Dtos/response/acceptInvitationResponse.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('invitations')
export class AcceptInvitationController {
  constructor(
    private readonly acceptInvitationService: AcceptInvitationService
  ) {}

  @Post(':id/accept')
  @UseGuards(AuthGuard('jwt'))
  async acceptInvitation(
    @Param('id') invitationId: string,
    @Body('receiverUserId') receiverUserId: string,
    @Body('organizationId') organizationId: string
  ): Promise<AcceptInvitationResponseDto> {
    return await this.acceptInvitationService.acceptInvitation(
      invitationId,
      receiverUserId,
      organizationId
    );
  }
}
