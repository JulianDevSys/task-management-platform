import { Controller, Get, Param } from "@nestjs/common";
import { GetTaskService } from "../services/getTask.service";


@Controller('tasks')
export class GetTaskController {
  constructor(
    private readonly getTaskService: GetTaskService
  ) {}

  @Get(':organizationId')
  async getTaskByIdOrganization(@Param('organizationId') organizationId: string) {
    const tasks = await this.getTaskService.getTaskByIdOrganization(organizationId);
    return {
      message: 'Tasks retrieved successfully',
      tasks
    }
  }
}