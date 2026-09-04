import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tasks } from "../entity/task.entity";
import { Repository } from "typeorm";


@Injectable()
export class GetTaskByIdService {
  constructor(
    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>
  ) {}

  async getTaskById(taskId: string) {
    const existingTask = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return existingTask;
  }
}