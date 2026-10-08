import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAiTaskDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  prompt: string;

}