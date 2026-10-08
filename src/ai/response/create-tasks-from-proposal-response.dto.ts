import { TaskResponseDto } from 'src/task/dtos/response/taskResponseDto';
import { FailedTaskDto } from '../dtos/failed-task.dto';

export class CreateTasksFromProposalResponseDto {
  created: TaskResponseDto[];

  failed: FailedTaskDto[];
}
