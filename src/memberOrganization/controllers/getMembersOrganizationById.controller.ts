import { Controller, Get, Param } from "@nestjs/common";
import { GetMembersOrganizationByIdService } from "../services/getMembersOrganizationById.service";


@Controller('memberOrganization')
export class GetMembersOrganizationByIdController{
  constructor(
    private readonly getMembersOrganizationByIdService: GetMembersOrganizationByIdService
  ){}

  @Get(':id')
  async getMembersOrganizationById(@Param('id') id: string){
    const membersOrganization = await this.getMembersOrganizationByIdService.getMembersOrganizationById(id);
    return {
      message: 'recieve data successufuly',
      membersOrganization
    }
  }
}