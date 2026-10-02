import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../enums/notification-type.enum';

export class NotificationCreateDto {
  @ApiProperty({
    example: '123',
    description: 'ID of the user who will receive the notification',
  })
  userId: string;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.TASK_ASSIGNED,
    description: 'Type of notification (INFO, WARNING, ERROR, SUCCESS)',
  })
  type: NotificationType;

  @ApiProperty({
    example: 'Your task has been assigned successfully.',
    description: 'Content of the notification message',
  })
  message: string;
}
