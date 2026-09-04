import { Injectable } from '@nestjs/common';
import { Tasks } from '../entity/task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskResponseGeneralDto } from '../dtos/response/taskResponseGeneralDto';

@Injectable()
export class GetTaskService {
  constructor(
    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>
  ) {}
  async getTaskByIdOrganization(
    organizationId: string
  ): Promise<TaskResponseGeneralDto[]> {
    const tasks = await this.taskRepository.find({
      where: { organization: { id: organizationId } },
      relations: { assignedTo: { userMember: true } },
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedToName: task.assignedTo?.userMember.name,
    }));
  }
}
