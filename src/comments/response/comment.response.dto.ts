import { ApiProperty } from '@nestjs/swagger';

class CommentUserSummaryDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef' })
  id: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;
}

class CommentTaskSummaryDto {
  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-2345678901fa' })
  id: string;
}

export class CommentResponseDto {
  @ApiProperty({ example: 'c3d4e5f6-a7b8-9012-cdef-3456789012ab' })
  id: string;

  @ApiProperty({ example: 'This task needs additional context.' })
  content: string;

  @ApiProperty({ example: false })
  edited: boolean;

  @ApiProperty({ example: '2026-09-15T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-15T12:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: CommentUserSummaryDto })
  user: CommentUserSummaryDto;

  @ApiProperty({ type: CommentTaskSummaryDto })
  task: CommentTaskSummaryDto;
}
