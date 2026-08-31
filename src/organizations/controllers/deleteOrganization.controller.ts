import { Controller, Delete, Param } from "@nestjs/common";
import { DeleteOrganizationService } from "../services/deleteOrganization.service";

@Controller('organization')

export class DeleteOrganizationController{
  constructor(
    private readonly deleteOrganizationService: DeleteOrganizationService
  ){} 

  @Delete(':id')
  async deleteOrganization(@Param('id') id: string) {
    const deleteOrganization=  this.deleteOrganizationService.deleteOrganization(id);
    return{
      message: 'organization deleted successufuly',
      deleteOrganization
    }
  }
}