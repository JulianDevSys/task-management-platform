import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { PriorityTask } from 'src/task/enums/priorityTask.enum';

/**
 * Representa una única tarea propuesta por la IA.
 * La IA solo genera el contenido de la tarea; el backend decide
 * si la crea, la valida y la asocia a la organización correcta.
 */
export class TaskProposalItemDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(PriorityTask)
  priority: PriorityTask;
}
