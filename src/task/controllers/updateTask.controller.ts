import { Controller, Param, Patch, Body } from '@nestjs/common';
import { UpdateTaskService } from '../services/updateTask.service';
import { UpdateTaskDto } from '../dtos/updateTask.dto';

@Controller('tasks')
export class UpdateTaskController {
  constructor(
    private readonly updateTaskService: UpdateTaskService
  ) {}

  @Patch(':id/:updatedByUserId')
  async updateTask(
    @Param('id') id: string,
    @Param('updatedByUserId') updatedByUserId: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    const updatedTask = await this.updateTaskService.updateTask(
      id,
      updateTaskDto,
      updatedByUserId
    );

    console.log(updatedTask,"controller")
    return {
      message: 'Task updated successfully',
      data: updatedTask,
    };
  }
}
