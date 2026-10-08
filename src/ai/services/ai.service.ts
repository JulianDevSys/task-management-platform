import { Injectable } from '@nestjs/common';

import { TaskProposalDto } from '../dtos/task-proposal.dto';

import { GenerateTaskProposalService } from './generate-task-proposal.service';

@Injectable()
export class AiService {
  constructor(
    private readonly generateTaskProposalService: GenerateTaskProposalService,
  ) {}

  async testAi(): Promise<string> {
    const response =
      await this.generateTaskProposalService.generate(
        'Necesito implementar un sistema de recuperación de contraseñas con envío de correos electrónicos.',
      );

    return JSON.stringify(response, null, 2);
  }

  async generateTaskProposal(
    prompt: string,
  ): Promise<TaskProposalDto> {
    return this.generateTaskProposalService.generate(prompt);
  }
}