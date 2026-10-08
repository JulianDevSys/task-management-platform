import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateTasksFromProposalService } from '../services/create-tasks-from-proposal.service';
import { ConfirmTaskProposalDto } from '../dtos/ConfirmTaskProposal.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';


@Controller()
export class ConfirmTaskProposalController {
  constructor(
    private readonly createTasksFromProposalService: CreateTasksFromProposalService
  ) {}

  @Post('tasks/confirm')
  @UseGuards(AuthGuard('jwt'))
  async confirmTaskProposal(
    @Body() dto: ConfirmTaskProposalDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.createTasksFromProposalService.execute(dto, user);
  }
}
