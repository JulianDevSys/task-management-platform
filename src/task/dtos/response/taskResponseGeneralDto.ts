import { ApiProperty } from '@nestjs/swagger';
import { PriorityTask } from 'src/task/enums/priorityTask.enum';
import { StatusTask } from 'src/task/enums/statusTask.enum';

export class TaskAttachmentMetadataDto {
  @ApiProperty({ description: 'ID único del archivo adjunto', example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef' })
  id: string;

  @ApiProperty({ description: 'Nombre original del archivo', example: 'reporte.pdf' })
  originalName: string;

  @ApiProperty({ description: 'Tipo MIME del archivo', example: 'application/pdf' })
  mimeType: string;

  @ApiProperty({ description: 'Tamaño del archivo en bytes', example: 245678 })
  size: number;

  @ApiProperty({ description: 'Ruta física del archivo en el almacenamiento actual', example: 'uploads/reporte.pdf' })
  path: string;
}

export class TaskResponseGeneralDto {
  @ApiProperty({
    description: 'ID único de la tarea',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
  })
  id: string;

  @ApiProperty({
    description: 'Título de la tarea',
    example: 'Implementar login',
  })
  title: string;

  @ApiProperty({
    description: 'Estado actual de la tarea',
    enum: StatusTask,
    example: StatusTask.PENDING,
  })
  status: StatusTask;

  @ApiProperty({
    description: 'Prioridad de la tarea',
    enum: PriorityTask,
    example: PriorityTask.MEDIUM,
  })
  priority: PriorityTask;

  @ApiProperty({
    description: 'Fecha límite de la tarea',
    example: '2026-09-15T23:59:59Z',
    required: false,
  })
  dueDate: Date | null;

  @ApiProperty({
    description: 'Nombre del miembro asignado a la tarea',
    example: 'Pedro Pérez',
    required: false,
  })
  assignedToName?: string;

  @ApiProperty({
    description: 'Metadatos de archivos adjuntos de la tarea',
    type: [TaskAttachmentMetadataDto],
    required: false,
  })
  attachments?: TaskAttachmentMetadataDto[];
}
