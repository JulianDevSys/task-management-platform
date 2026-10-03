import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';
import { NotificationResponseDto } from '../response/notification.response';

@Injectable()
export class MarkNotificationAsReadService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) {}

  async markNotificationAsRead(
    notificationId: string,
    authenticatedUser: { userId: string; email: string; role: string },
    read: boolean
  ): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.findOne({
      where: {
        id: notificationId,
        user: { id: authenticatedUser.userId },
      },
      relations: { user: true },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.user.id !== authenticatedUser.userId) {
      throw new ForbiddenException(
        'You do not have access to this notification'
      );
    }

    notification.read = read;
    const updatedNotification =
      await this.notificationRepository.save(notification);

    return {
      id: updatedNotification.id,
      type: updatedNotification.type,
      message: updatedNotification.message,
      read: updatedNotification.read,
      createdAt: updatedNotification.createdAt,
      user: {
        id: updatedNotification.user.id,
        name: updatedNotification.user.name,
      },
    };
  }
}
