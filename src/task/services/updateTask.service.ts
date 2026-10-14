import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from '../dtos/updateTask.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from '../entity/task.entity';
import { DataSource, Repository } from 'typeorm';
import { TaskResponseDto } from '../dtos/response/taskResponseDto';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { RedisService } from 'src/redis/redis.service';
import { CreateNotificationService } from 'src/notifications/services/createNotification.service';
import { NotificationType } from 'src/notifications/enums/notification-type.enum';

@Injectable()
export class UpdateTaskService {
  constructor(
    @InjectRepository(Tasks)
    private readonly taskRepository: Repository<Tasks>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(MembersOrganization)
    private readonly membersOrganizationRepository: Repository<MembersOrganization>,
    private readonly redisService: RedisService,
    private readonly createNotificationService: CreateNotificationService,
    private readonly dataSource: DataSource,
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

    const previousAssignedUserId = existingTask.assignedTo?.userMember?.id;
    let assignedToMember = existingTask.assignedTo;

    if (updateTaskDto.assignedToId) {
      const foundAssignedMember = await this.membersOrganizationRepository.findOne(
        {
          where: {
            userMember: { id: updateTaskDto.assignedToId },
            organization: { id: updateTaskDto.organizationId },
          },
          relations: { userMember: true },
        }
      );

      if (!foundAssignedMember) {
        throw new NotFoundException(
          `Member with ID ${updateTaskDto.assignedToId} not found in this organization`
        );
      }

      assignedToMember = foundAssignedMember;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      existingTask.title = updateTaskDto.title ?? existingTask.title;
      existingTask.description =
        updateTaskDto.description ?? existingTask.description;
      existingTask.status = updateTaskDto.status ?? existingTask.status;
      existingTask.priority = updateTaskDto.priority ?? existingTask.priority;
      existingTask.dueDate = updateTaskDto.dueDate
        ? new Date(updateTaskDto.dueDate)
        : existingTask.dueDate;
      existingTask.assignedTo = assignedToMember;

      const taskRepo = queryRunner.manager.getRepository(Tasks);
      const updatedTask = await taskRepo.save(existingTask);

      const nextAssignedUserId = assignedToMember?.userMember?.id;
      if (nextAssignedUserId && nextAssignedUserId !== previousAssignedUserId) {
        await this.createNotificationService.createNotification(
          {
            userId: nextAssignedUserId,
            type: NotificationType.TASK_ASSIGNED,
            message: `Se te ha reasignado la tarea "${updatedTask.title}".`,
          },
          queryRunner.manager,
        );
      }

      await queryRunner.commitTransaction();

      const cacheKey = `tasks:organization:${existingTask.organization.id}`;
      await this.redisService.delete(cacheKey);

      return {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
        dueDate: updatedTask.dueDate,
        assignedByName: existingTask.assignedBy.userMember.name,
        organizationName: existingTask.organization.name,
        assignedToName: assignedToMember?.userMember.name,
        createdAt: updatedTask.createdAt,
        updatedAt: updatedTask.updatedAt,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
