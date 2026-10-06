import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Updated comment content.',
    example: 'Updated comment with more accurate context.',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  content: string;
}
