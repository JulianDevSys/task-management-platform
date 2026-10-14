import { Injectable } from '@nestjs/common';
import { Tasks } from '../entity/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskResponseGeneralDto } from '../dtos/response/taskResponseGeneralDto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class GetTaskService {
  constructor(
    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>,
    private readonly redisService: RedisService
  ) {}
  async getTaskByIdOrganization(
    organizationId: string
  ): Promise<TaskResponseGeneralDto[]> {
    const cacheKey = `tasks:organization:${organizationId}`;
    const cachedTasks = await this.redisService.get(cacheKey);
    if (cachedTasks) {
      return JSON.parse(cachedTasks);
    }

    const tasks = await this.taskRepository.find({
      where: { organization: { id: organizationId } },
      relations: {
        assignedTo: { userMember: true },
        attachments: true,
      },
    });

    const taskResponse = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedToName: task.assignedTo?.userMember.name,
      attachments: (task.attachments ?? []).map((attachment) => ({
        id: attachment.id,
        originalName: attachment.originalName,
        mimeType: attachment.mimeType,
        size: attachment.size,
        path: attachment.path,
      })),
    }));

    await this.redisService.set(cacheKey, JSON.stringify(taskResponse), 60);

    return taskResponse;
  }
}
