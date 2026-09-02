import { Body, Controller, Post } from "@nestjs/common";
import { CreateTaskService } from "../services/createTask.service";
import { CreateTaskDto } from "../dtos/createTask.dto";


@Controller('tasks')
export class CreateTaskController{
  constructor(private readonly createTaskService: CreateTaskService) {}

  @Post()
  async createTask(@Body()createTaskDto: CreateTaskDto) {
    const newTask = await this.createTaskService.createTask(createTaskDto);
    return {
      message: 'Task created successfully',
      task: newTask,
    };
  }
    }
