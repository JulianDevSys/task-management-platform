import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateInvitationService } from '../services/createInvitation.service';
import { CreateInvitationDto } from '../Dtos/createInvitation.dto';

@Controller('invitation')
export class CreateInvitationController {
  constructor(
    private readonly createInvitationService: CreateInvitationService
  ) {}

  @Post(':idAdmin')
  async createInvitation(
    @Param('idAdmin') idAdmin: string,
    @Body() createInvitationDto: CreateInvitationDto
  ) {
    const invitation = await this.createInvitationService.createInvitation(
      idAdmin,
      createInvitationDto
    );
    return {
      message: 'invitation send successufuly',
      invitation,
    };
  }
}
