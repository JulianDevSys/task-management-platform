import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';
import { NotificationResponseDto } from '../response/notification.response';

@Injectable()
export class GetMyNotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async getMyNotifications(authenticatedUser: {
    userId: string;
    email: string;
    role: string;
  }): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.find({
      where: { user: { id: authenticatedUser.userId } },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });

    return notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt,
      user: {
        id: notification.user.id,
        name: notification.user.name,
      },
    }));
  }
}
