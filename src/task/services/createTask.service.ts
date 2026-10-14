import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tasks } from '../entity/task.entity';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { CreateTaskDto } from '../dtos/createTask.dto';
import { TaskResponseDto } from '../dtos/response/taskResponseDto';
import { RedisService } from 'src/redis/redis.service';
import { CreateNotificationService } from 'src/notifications/services/createNotification.service';
import { NotificationType } from 'src/notifications/enums/notification-type.enum';
import { DataSource } from 'typeorm';

@Injectable()
export class CreateTaskService {
  logger = new Logger('CreateTaskService');
  constructor(
    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(MembersOrganization)
    private memberOrganizationRepository: Repository<MembersOrganization>,
    private readonly redisService: RedisService,
    private readonly createNotificationService: CreateNotificationService,
    private readonly dataSource: DataSource
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
      relations: {
        userMember: true,
      },
    });

    if (!memberAssignedBy) {
      throw new NotFoundException(
        'member assigned by not found in this organization'
      );
    }

    ////////////////////////////////////////////////////////////////////////

    let assignedTo: MembersOrganization | null = null;

    if (assignedToId) {
      assignedTo = await this.memberOrganizationRepository.findOne({
        where: {
          userMember: { id: assignedToId },
          organization: {
            id: organizationId,
          },
        },
        relations: {
          userMember: true,
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
      where: {
        title,
        organization: {
          id: organizationId,
        },
      },
    });

    if (task) {
      throw new NotFoundException('task already exists');
    }

    ////////////////////////////////////////////////////////////////////////
    // Iniciamos la transacción
    ////////////////////////////////////////////////////////////////////////

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //////////////////////////////////////////////////////////////////////
      // Creamos la tarea usando el repository de la transacción
      //////////////////////////////////////////////////////////////////////

      const taskRepository = queryRunner.manager.getRepository(Tasks);

      const newTask = taskRepository.create({
        title,
        description,
        status,
        priority,
        dueDate,
        organization,
        assignedTo,
        assignedBy: memberAssignedBy,
      });

      await taskRepository.save(newTask);

      //////////////////////////////////////////////////////////////////////
      // Creamos la notificación dentro de la misma transacción
      //////////////////////////////////////////////////////////////////////

      if (assignedTo) {
        await this.createNotificationService.createNotification(
          {
            userId: assignedTo.userMember.id,
            type: NotificationType.TASK_ASSIGNED,
            message: `Se te ha asignado la tarea "${newTask.title}"`,
          },
          queryRunner.manager
        );
      }

      //////////////////////////////////////////////////////////////////////
      // Si todo salió bien, confirmamos la transacción
      //////////////////////////////////////////////////////////////////////

      await queryRunner.commitTransaction();

      //////////////////////////////////////////////////////////////////////
      // Redis está fuera de la transacción de PostgreSQL.
      // Por eso lo invalidamos después del COMMIT.
      //////////////////////////////////////////////////////////////////////

      const cacheKey = `tasks:organization:${organizationId}`;

      await this.redisService.delete(cacheKey);

      //////////////////////////////////////////////////////////////////////
      // Obtenemos la tarea creada para construir la respuesta
      //////////////////////////////////////////////////////////////////////

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
    } catch (error) {
      //////////////////////////////////////////////////////////////////////
      // Si Task o Notification fallan, deshacemos toda la transacción
      //////////////////////////////////////////////////////////////////////

      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      //////////////////////////////////////////////////////////////////////
      // Liberamos la conexión utilizada por el QueryRunner
      //////////////////////////////////////////////////////////////////////

      await queryRunner.release();
    }
  }
}
