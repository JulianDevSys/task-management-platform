import { Body, Controller, Post } from "@nestjs/common";

import { CreateOrganizationDto } from "../Dtos/createOrganization.dto";
import { CreateOrganizationService } from "../services/createOrganization.service";


@Controller('organization')

export class CreateOrganizationController{
  constructor(
    private readonly  createOrganizationService: CreateOrganizationService
  ){}

  @Post()
  async createOrganization(@Body() organizationData: CreateOrganizationDto){
    const organization = await this.createOrganizationService.createOrganization(organizationData)
    return{
      message: 'organization created successufuly',
      organization
    }
  }
}