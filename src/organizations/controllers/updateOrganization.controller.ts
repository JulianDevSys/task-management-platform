import { Body, Controller, Param, Patch } from "@nestjs/common";
import { UpdateOrganizationService } from "../services/updateOrganization.service";
import { UpdateOrganizationDto } from "../Dtos/updateOrganizationDto";



@Controller('organization')

export class UpdateOrganizationController{
  constructor(
    private readonly updateOrganizationService: UpdateOrganizationService
  ){}

  @Patch(':id')
  async updateOrganization(@Param('id') id: string, @Body() organizationData: UpdateOrganizationDto) {
    const organization = await this.updateOrganizationService.updateOrganization(organizationData, id)
    return {
      message: 'organization updated successfully',
      organization
    }
  }
}