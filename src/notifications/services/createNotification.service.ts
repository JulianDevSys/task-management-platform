
import { Injectable, NotFoundException } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { Notification } from '../entity/notification.entity';

import { NotificationCreateDto } from '../dto/createNotification.dto';

import { NotificationResponseDto } from '../response/notification.response';

import { User } from 'src/users/entity/User.entity';

@Injectable()
export class CreateNotificationService {
  /**
   * Crea una notificación utilizando el EntityManager recibido.
   *
   * Cuando este servicio es llamado dentro de una transacción,
   * el manager pertenece al mismo QueryRunner que utiliza
   * CreateTaskService.
   *
   * De esta manera, Task y Notification pueden hacer
   * COMMIT o ROLLBACK como una sola operación.
   */
  async createNotification(
    createNotificationDto: NotificationCreateDto,
    manager: EntityManager,
  ): Promise<NotificationResponseDto> {
    const { userId, type, message } = createNotificationDto;

    // Obtenemos los repositorios desde el manager transaccional.
    // Así las operaciones utilizan la misma transacción.
    const userRepo = manager.getRepository(User);
    const notificationRepo = manager.getRepository(Notification);

    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newNotification = notificationRepo.create({
      message,
      type,
      user,
    });

    const savedNotification = await notificationRepo.save(newNotification);

    return {
      id: savedNotification.id,
      type: savedNotification.type,
      message: savedNotification.message,
      read: savedNotification.read,
      createdAt: savedNotification.createdAt,
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }
}
