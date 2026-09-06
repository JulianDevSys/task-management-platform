import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from '../dtos/updateTask.dto';
import { TaskResponseGeneralDto } from '../dtos/response/taskResponseGeneralDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from '../entity/task.entity';
import { Repository } from 'typeorm';
import { TaskResponseDto } from '../dtos/response/taskResponseDto';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';

@Injectable()
export class UpdateTaskService {
  constructor(
    @InjectRepository(Tasks)
    private readonly taskRepository: Repository<Tasks>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(MembersOrganization)
    private readonly membersOrganizationRepository: Repository<MembersOrganization>
  ) {}
  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    updatedByUserId: string
  ): Promise<TaskResponseDto> {
    const existingTask = await this.taskRepository.findOne({
      where: { id },
      relations: {
        organization: true,
        assignedTo: { userMember: true },
        assignedBy: { userMember: true },
      },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (updateTaskDto.organizationId != existingTask.organization.id) {
      throw new NotFoundException(
        `Organization with ID ${updateTaskDto.organizationId} not found`
      );
    }

    const memberUpdating = await this.membersOrganizationRepository.findOne({
      where: {
        userMember: { id: updatedByUserId },
        organization: { id: updateTaskDto.organizationId },
      },
    });

    if (!memberUpdating) {
      throw new NotFoundException(
        `User ${updatedByUserId} is not a member of this organization`
      );
    }

    let assignedToMember = existingTask.assignedTo;

    if (updateTaskDto.assignedToId) {
      const assignedToMember = await this.membersOrganizationRepository.findOne(
        {
          where: {
            userMember: { id: updateTaskDto.assignedToId },
            organization: { id: updateTaskDto.organizationId },
          }, relations: {userMember: true}
        }
      );

      if (!assignedToMember) {
        throw new NotFoundException(
          `Member with ID ${updateTaskDto.assignedToId} not found in this organization`
        );
      }
    }

    existingTask.title = updateTaskDto.title ?? existingTask.title;
    existingTask.description = updateTaskDto.description ?? existingTask.description;
    existingTask.status = updateTaskDto.status ?? existingTask.status;
    existingTask.priority = updateTaskDto.priority ?? existingTask.priority;
    existingTask.dueDate = updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : existingTask.dueDate;
    existingTask.assignedTo = assignedToMember;

    const updatedTask = await this.taskRepository.save(existingTask); 

    console.log(updatedTask,"llego")

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
      assignedByName: existingTask.assignedBy.userMember.name,
      organizationName:existingTask.organization.name ,
      assignedToName: assignedToMember?.userMember.name,
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt,
    };
  }
}
