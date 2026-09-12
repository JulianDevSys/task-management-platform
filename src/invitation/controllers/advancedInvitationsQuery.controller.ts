import { Controller, Get, Param, Query } from '@nestjs/common';
import { InvitationFiltersDto } from '../Dtos/invitationFilters.dto';
import { AdvancedInvitationsQueryService } from '../services/advancedInvitationsQuery.service';

@Controller()
export class advancedInvitationsQueryController {
  constructor(
    private readonly advancedInvitationsQueryService: AdvancedInvitationsQueryService
  ) {}

  @Get(':organizationId/invitations')
  async AdvancedInvitationsQuery(
    @Param('organizationId') organizationId: string,
    @Query() filters: InvitationFiltersDto
  ) {
    const invitation =
      await this.advancedInvitationsQueryService.advancedInvitationsQuery(
        organizationId,
        filters
      );
    return {
      message: 'invitation successufuly',
      invitation,
    };
  }
}
