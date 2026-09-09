import { Body, Controller, Delete, Param } from "@nestjs/common";
import { DeleteInvitationService } from "../services/deleteInvitation.service";

@Controller('invitation')
export class DeleteInvitationController{
  constructor(
    private readonly deleteInviatationService: DeleteInvitationService
  ){}

  @Delete(':invitationId')
  async deleteInvitation(@Param('invitationId') invitationId:string, @Body('adminId') adminId: string){
    const invitation = await this.deleteInviatationService.deleteInvitation(invitationId, adminId)
    return{
      message: 'invitation delete successufuly',
      invitation
    }
  }
}