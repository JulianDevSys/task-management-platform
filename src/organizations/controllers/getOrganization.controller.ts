import { Controller, Get } from "@nestjs/common";
import { GetOrganizationService } from "../services/getOrganization.service";



@Controller('organization')

export class GetOrganizationController{
  constructor(
    private readonly  getOrganizationService: GetOrganizationService
  ){}

  @Get()
  async findAllOrganization (){
    const orgnanization= await this.getOrganizationService.findAllOrganization()
    return{
      message: 'recieve data successufuly',
      orgnanization
    }
  }
}