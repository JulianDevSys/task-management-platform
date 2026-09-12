import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { InvitationStatus } from '../enums/invitationStatus.enum';

export class InvitationFiltersDto {
  @ApiPropertyOptional({
    description: 'Estado de la invitación',
    enum: InvitationStatus,
    example: InvitationStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(InvitationStatus)
  status?: InvitationStatus;

  @ApiPropertyOptional({
    description: 'Fecha inicial de creación (formato ISO)',
    example: '2026-09-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  createdFrom?: Date;

  @ApiPropertyOptional({
    description: 'Fecha final de creación (formato ISO)',
    example: '2026-09-10T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  createdTo?: Date;

  @ApiPropertyOptional({
    description: 'Fecha inicial de expiración (formato ISO)',
    example: '2026-09-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  expiresFrom?: Date;

  @ApiPropertyOptional({
    description: 'Fecha final de expiración (formato ISO)',
    example: '2026-09-10T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  expiresTo?: Date;

  @ApiPropertyOptional({
    description: 'ID del usuario receptor',
    example: 'user-123',
  })
  @IsOptional()
  @IsString()
  receiverUserId?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario remitente',
    example: 'user-456',
  })
  @IsOptional()
  @IsString()
  senderUserId?: string;

  @ApiPropertyOptional({
    description: 'Columna por la cual ordenar (ej: createdAt, expiresAt)',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({
    description: 'Dirección de ordenamiento',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
  })
  @IsOptional()
  @IsString()
  orderDirection?: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description: 'Número máximo de resultados',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({
    description: 'Número de resultados a saltar (offset)',
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  offset?: number;
}
