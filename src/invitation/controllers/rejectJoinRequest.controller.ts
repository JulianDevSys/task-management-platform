import { Controller, Param, Post, Body } from '@nestjs/common';
import { RejectJoinRequestService } from '../services/rejectJoinRequest.service';



@Controller('join-requests')
export class RejectJoinRequestController {
  constructor(
    private readonly rejectJoinRequestService: RejectJoinRequestService,
  ) {}

  @Post(':id/reject')
  async rejectJoinRequest(
    @Param('id') requestId: string,
    @Body('organizationId') organizationId: string,
    @Body('receiverUserId') receiverUserId: string,
    @Body('adminId') adminId: string,
  ) {
    const rejectInvitation=  await this.rejectJoinRequestService.rejectJoinRequest(
      organizationId,
      receiverUserId,
      adminId,
    );

    return{
      message: 'invitacion reject successufuly',
      rejectInvitation
    }
  }
}
