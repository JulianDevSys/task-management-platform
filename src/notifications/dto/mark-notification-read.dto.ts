import { ApiProperty } from '@nestjs/swagger';

export class MarkNotificationAsReadDto {
  @ApiProperty({ example: true, description: 'Set the notification as read or unread' })
  read: boolean;
}
