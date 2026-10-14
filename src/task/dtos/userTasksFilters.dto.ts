import { IsEnum, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { StatusTask } from '../enums/statusTask.enum';
import { PriorityTask } from '../enums/priorityTask.enum';

export class UserTasksFiltersDto {
  @IsOptional()
  @IsEnum(StatusTask)
  status?: StatusTask;

  @IsOptional()
  @IsEnum(PriorityTask)
  priority?: PriorityTask;

  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @IsOptional()
  @IsDateString()
  createdTo?: string;


  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsString()
  orderDirection?: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  offset?: number;
}
