import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from '../entity/task.entity';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { CreateTaskDto } from '../dtos/createTask.dto';
import { TaskResponseDto } from '../dtos/response/taskResponseDto';

@Injectable()
export class CreateTaskService {
  logger = new Logger('CreateTaskService');
  constructor(
    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(MembersOrganization)
    private memberOrganizationRepository: Repository<MembersOrganization>
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      organizationId,
      assignedToId,
      assignedById,
    } = createTaskDto;

    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('organization not found');
    }

    ////////////////////////////////////////////////////////////////////////

    const memberAssignedBy = await this.memberOrganizationRepository.findOne({
      where: {
        userMember: { id: assignedById },
        organization: {
          id: organizationId,
        },
      },
    });
    if (!memberAssignedBy) {
      throw new NotFoundException(
        'member assigned by not found in this organization'
      );
    }

    //////////////////////////////////////////////////////////////////////////

    let assignedTo: MembersOrganization | null = null;

    if (assignedToId) {
      assignedTo = await this.memberOrganizationRepository.findOne({
        where: {
          userMember: { id: assignedToId },
          organization: {
            id: organizationId,
          },
        },
      });

      if (!assignedTo) {
        throw new NotFoundException(
          'Assigned member not found in this organization'
        );
      }
    }
    ////////////////////////////////////////////////////////////////////////

    const task = await this.taskRepository.findOne({
      where: { title, organization: { id: organizationId } },
    });
    if (task) {
      throw new NotFoundException('task already exists');
    }

    const newTask = this.taskRepository.create({
      title,
      description,
      status: status,
      priority: priority,
      dueDate,
      organization,
      assignedTo,
      assignedBy: memberAssignedBy,
    });

    await this.taskRepository.save(newTask);

    const returnResponse = await this.taskRepository.findOne({
      where: { id: newTask.id },
      relations: {
        organization: true,
        assignedTo: { userMember: true },
        assignedBy: { userMember: true },
      },
    });

    return {
      id: newTask.id,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      createdAt: newTask.createdAt,
      updatedAt: newTask.updatedAt,
      organizationName: returnResponse?.organization?.name!,
      assignedToName: returnResponse?.assignedTo?.userMember?.name ?? '',
      assignedByName: returnResponse?.assignedBy?.userMember?.name ?? '',
    };
  }
}
