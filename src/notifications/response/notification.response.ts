import { ApiProperty } from '@nestjs/swagger';

class NotificationUserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef' })
  id: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;
}

export class NotificationResponseDto {
  @ApiProperty({ example: 'c3d4e5f6-a7b8-9012-cdef-3456789012ab' })
  id: string;

  @ApiProperty({ example: 'task_assigned' })
  type: string;

  @ApiProperty({ example: 'You were assigned to a task.' })
  message: string;

  @ApiProperty({ example: false })
  read: boolean;

  @ApiProperty({ example: '2026-09-15T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: NotificationUserResponseDto })
  user: NotificationUserResponseDto;
}
