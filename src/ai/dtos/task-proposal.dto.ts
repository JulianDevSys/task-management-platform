import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { TaskProposalItemDto } from './task-proposal-item.dto';



/**
 * Representa la respuesta completa y estructurada generada por la IA.
 * El modelo entrega una lista de propuestas que luego el backend valida.
 */
export class TaskProposalDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskProposalItemDto)
  tasks: TaskProposalItemDto[];
}

/*  
@Type() le indica a class-transformer qué clase utilizar para transformar los elementos del array.

@ValidateNested() le indica a class-validator que también debe validar cada tarea individual.

Así, si una tarea tiene una prioridad inválida, 
no basta con que el array sea correcto: también se comprueba el contenido de cada elemento.*/