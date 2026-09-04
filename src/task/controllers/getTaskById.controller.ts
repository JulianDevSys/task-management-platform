import { Controller, Get, Param } from '@nestjs/common';
import { GetTaskByIdService } from '../services/getTaskById.service';

@Controller('tasks')
export class GetTaskByIdController {
  constructor(private readonly getTaskByIdService: GetTaskByIdService) {}

  @Get(':taskId')
  async getTaskById(@Param('taskId') taskId: string) {
    const task = await this.getTaskByIdService.getTaskById(taskId);
    return {
      message: `Task with ID ${taskId} retrieved successfully`,
      task,
    };
  }
}
