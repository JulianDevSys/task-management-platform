import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';

import { TaskModule } from 'src/task/task.module';

import { AiController } from './controller/ai.controller';

import { AiService } from './services/ai.service';
import { GenerateTaskProposalService } from './services/generate-task-proposal.service';
import { CreateTasksFromProposalService } from './services/create-tasks-from-proposal.service';
import { ConfirmTaskProposalController } from './controller/confirmTaskProposal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MembersOrganization]), TaskModule],

  controllers: [AiController, ConfirmTaskProposalController],

  providers: [
    AiService,
    GenerateTaskProposalService,
    CreateTasksFromProposalService,
  ],

  exports: [AiService],
})
export class AiModule {}
