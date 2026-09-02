import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { StatusTask } from '../enums/statusTask.enum';
import { PriorityTask } from '../enums/priorityTask.enum';


export class CreateTaskDto {
  @ApiProperty({
    description: 'Título corto de la tarea',
    example: 'Implementar login',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descripción detallada de la tarea',
    example: 'Crear endpoint de autenticación con JWT',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Estado inicial de la tarea',
    enum: StatusTask,
    example: StatusTask.PENDING,
    required: false,
  })
  @IsEnum(StatusTask)
  @IsOptional()
  status?: StatusTask;

  @ApiProperty({
    description: 'Prioridad de la tarea',
    enum: PriorityTask,
    example: PriorityTask.LOW,
    required: false,
  })
  @IsEnum(PriorityTask)
  @IsOptional()
  priority?: PriorityTask;

  @ApiProperty({
    description: 'Fecha límite de la tarea',
    example: '2026-09-15T23:59:59Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({
    description: 'ID de la organización a la que pertenece la tarea',
    example: 'c1a2b3c4-d5e6-f7g8-h9i0-j1k2l3m4n5o6',
  })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({
    description: 'ID del miembro al que se asigna la tarea',
    example: 'm1n2o3p4-q5r6-s7t8-u9v0-w1x2y3z4a5b6',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  assignedToId?: string;

  @ApiProperty({
    description: 'ID del miembro que crea la tarea',
    example: 'z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4',
  })
  @IsUUID()
  @IsNotEmpty()
  assignedById: string;
}
