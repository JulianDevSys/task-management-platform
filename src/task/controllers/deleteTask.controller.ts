import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteTaskService } from '../services/deleteTask.service';

@Controller('tasks')
export class DeleteTaskController {
  constructor(private readonly deleteTaskService: DeleteTaskService) {}

  @Delete(':taskId')
  async deleteTask(@Param('taskId') taskId: string) {
    const task = await this.deleteTaskService.deleteTask(taskId);
    return {
      message: `Task with ID ${taskId} has been deleted successfully`,
      task,
    };
  }
}
