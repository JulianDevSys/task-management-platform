import { Controller, Get, Param } from '@nestjs/common';
import { GetOrganizationByIdService } from '../services/getOrganizationById.service';

@Controller('organization')
export class GetOrganizationByIdController {
  constructor(
    private readonly getOrganizationByIdService: GetOrganizationByIdService
  ) {}

  @Get(':id')
  async findOrganizationById(@Param('id') id: string) {
    const organization =
      await this.getOrganizationByIdService.findOrganizationById(id);
    return {
      message: 'recieve data successufuly',
      organization,
    };
  }
}
