import { Body, Controller, Delete, Param } from "@nestjs/common";
import { DeleteMemberService } from "../services/deleteMemberByAdmin.service";
import { DeleteMemberDto } from "../dto/deleteMember.dto";


@Controller('members')

export class DeleteMemberController{
  constructor(
    private readonly deleteMemberService : DeleteMemberService
  ){}

@Delete(':idAdmin')
async deleteMember(@Body()deleteMemberDto: DeleteMemberDto, @Param('idAdmin') idAdmin:string){
  const member = await this.deleteMemberService.deleteMember(idAdmin,deleteMemberDto)
  return{
    message: 'user delete with successufuly',
    member
  }
}

}