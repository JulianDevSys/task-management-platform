import { Injectable, NotFoundException } from '@nestjs/common';
import { Tasks } from '../entity/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class DeleteTaskService {
  constructor(
    @InjectRepository(Tasks)
    private readonly taskRepository: Repository<Tasks>,
    private readonly redisService: RedisService
  ) {}

  async deleteTask(taskId: string) {
    const taskToDelete = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: {
        organization: true,
      },
    });

    if (!taskToDelete) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    await this.taskRepository.delete(taskId);

    const cacheKey = `tasks:organization:${taskToDelete.organization.id}`;
     await this.redisService.delete(cacheKey);
  }
}
