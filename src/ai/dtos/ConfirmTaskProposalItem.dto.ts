import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { PriorityTask } from 'src/task/enums/priorityTask.enum';

export class ConfirmTaskProposalItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(PriorityTask)
  priority: PriorityTask;
}