import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ConfirmTaskProposalItemDto } from './ConfirmTaskProposalItem.dto';
import { Type } from 'class-transformer';

export class ConfirmTaskProposalDto {

  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ConfirmTaskProposalItemDto)
  tasks: ConfirmTaskProposalItemDto[];

}