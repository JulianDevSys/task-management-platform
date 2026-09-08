import { Body, Controller, Param, Patch } from "@nestjs/common";
import { UpdateMemberService } from "../services/updateMemberRole.service";
import { UpdateMemberDto } from "../dto/updateMember.dto";

@Controller('members')

export class UpdateMemberController{
  constructor(
    private readonly  updateMemberService: UpdateMemberService
  ){}

  @Patch(':userId')
  async updateMember(@Param('userId') userId:string, @Body()updateMemberDto :UpdateMemberDto){
    const member = await this.updateMemberService.updateMember(userId,updateMemberDto)
    return{
      message: 'member update successufuly',
      member
    }
  }
}