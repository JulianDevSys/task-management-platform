import { Controller, Post, Body } from '@nestjs/common';
import { CreateJoinRequestService } from '../services/createJoinRequest.service';


@Controller('join-requests')
export class CreateJoinRequestController {
  constructor(
    private readonly createJoinRequestService: CreateJoinRequestService,
  ) {}

  @Post()
  async createJoinRequest(
    @Body('organizationId') organizationId: string,
    @Body('userId') userId: string,
  ) {
    const invitation=  await this.createJoinRequestService.createJoinRequest(
      organizationId,
      userId,
    );
    return{
      message: 'invitation created succesufuly',
      invitation
    }
  }
}
