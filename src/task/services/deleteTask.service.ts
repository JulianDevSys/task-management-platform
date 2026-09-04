import { Injectable, NotFoundException } from '@nestjs/common';
import { Tasks } from '../entity/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeleteTaskService {
  constructor(
    @InjectRepository(Tasks)
    private readonly taskRepository: Repository<Tasks>) {}

  async deleteTask(taskId: string) {
    const taskToDelete = await this.taskRepository.exists({ where: { id: taskId } });

    if (!taskToDelete) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    await this.taskRepository.delete(taskId);
  }
}
