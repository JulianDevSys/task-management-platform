import { Controller, Get, Param } from '@nestjs/common';
import { GetInvitationByOrganizationService } from '../services/getInvitationByOrganization.service';
import { InvitationResponseDto } from '../Dtos/response/InvitationResponse.dto';

@Controller('invitation')
export class GetInvitationByOrganizationController {
  constructor(
    private readonly getInvitationByOrganizationService: GetInvitationByOrganizationService
  ) {}

  @Get(':organizationId')
  async findInvitationByOrganization(
    @Param('organizationId') organizationId: string
  ) {
    const invitation =
      await this.getInvitationByOrganizationService.findInvitationByOrganization(
        organizationId
      );

    return {
      message: 'invitation return succesufuly',
      invitation
    };
  }
}
