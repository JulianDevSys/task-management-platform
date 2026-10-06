import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID of the task where the comment is created.',
    example: 'e7f7f0d4-5c7a-4d2b-92c3-3d68d88f2d5a',
  })
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @ApiProperty({
    description: 'Comment content. It cannot be empty and is limited to 2000 characters.',
    example: 'This task needs additional context before we proceed.',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  content: string;
}
