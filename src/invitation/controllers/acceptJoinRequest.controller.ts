import { Controller, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AcceptJoinRequestService } from '../services/aceptJoinRequest.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('join-requests')
export class AcceptJoinRequestController {
  constructor(
    private readonly acceptJoinRequestService: AcceptJoinRequestService
  ) {}

  @Post(':id/accept')
  @UseGuards(AuthGuard('jwt'))
  async acceptJoinRequest(
    @Param('id') receiverUserId: string,
    @Body('organizationId') organizationId: string,
    @Body('adminUserId') adminUserId: string
  ) {
    const acceptInvitation =
      await this.acceptJoinRequestService.acceptJoinRequest(
        organizationId,
        receiverUserId,
        adminUserId
      );

    return {
      message: ' invitation accept successufuly',
      acceptInvitation,
    };
  }
}
