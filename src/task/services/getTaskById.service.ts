import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from '../entity/task.entity';
import { Repository } from 'typeorm';
import { TaskResponseDto } from '../dtos/response/taskResponseDto';

@Injectable()
export class GetTaskByIdService {
  constructor(
    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>
  ) {}

  async getTaskById(taskId: string): Promise<TaskResponseDto> {
    const existingTask = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: {
        organization: true,
        assignedTo: { userMember: true },
        assignedBy: { userMember: true },
      },
    });
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return {
      id: existingTask.id,
      title: existingTask.title,
      description: existingTask.description,
      status: existingTask.status,
      priority: existingTask.priority,
      dueDate: existingTask.dueDate,
      createdAt: existingTask.createdAt,
      updatedAt: existingTask.updatedAt,
      assignedToName: existingTask.assignedTo
        ? existingTask.assignedTo.userMember.name
        : '',
      assignedByName: existingTask.assignedBy.userMember.name,
      organizationName: existingTask.organization.name,
    };
  }
}
