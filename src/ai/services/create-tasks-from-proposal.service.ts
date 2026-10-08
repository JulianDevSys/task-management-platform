import { ForbiddenException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';

import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';

import { CreateTaskService } from 'src/task/services/createTask.service';

import { CreateTaskDto } from 'src/task/dtos/createTask.dto';
import { ConfirmTaskProposalDto } from '../dtos/ConfirmTaskProposal.dto';
import { CreateTasksFromProposalResponseDto } from '../response/create-tasks-from-proposal-response.dto';

@Injectable()
export class CreateTasksFromProposalService {
  constructor(
    private readonly createTaskService: CreateTaskService,

    @InjectRepository(MembersOrganization)
    private readonly memberOrganizationRepository: Repository<MembersOrganization>
  ) {}

  async execute(
    dto: ConfirmTaskProposalDto,
    user: JwtUser
  ): Promise<CreateTasksFromProposalResponseDto> {
    const membership = await this.memberOrganizationRepository.findOne({
      where: {
        userMember: {
          id: user.userId,
        },
        organization: {
          id: dto.organizationId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this organization');
    }

    //Obtén el tipo de la propiedad "created" de CreateTasksFromProposalResponseDto.
    const created: CreateTasksFromProposalResponseDto['created'] = [];

    const failed: CreateTasksFromProposalResponseDto['failed'] = [];

    for (const task of dto.tasks) {
      try {
        const createTaskDto: CreateTaskDto = {
          title: task.title,
          description: task.description,
          priority: task.priority,

          organizationId: dto.organizationId,

          assignedById: user.userId,
        };

        const newTask = await this.createTaskService.createTask(createTaskDto);

        created.push(newTask);
      } catch (error) {
        failed.push({
          title: task.title,
          reason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      created,
      failed,
    };
  }
}
