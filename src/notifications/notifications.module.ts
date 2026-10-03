import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/User.entity';
import { Notification } from './entity/notification.entity';
import { GetMyNotificationsController } from './controllers/get-my-notifications.controller';
import { MarkNotificationAsReadController } from './controllers/mark-notification-as-read.controller';
import { GetMyNotificationsService } from './services/get-my-notifications.service';
import { MarkNotificationAsReadService } from './services/mark-notification-as-read.service';
import { CreateNotificationService } from './services/createNotification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User])],
  controllers: [GetMyNotificationsController, MarkNotificationAsReadController],
  providers: [GetMyNotificationsService, MarkNotificationAsReadService, CreateNotificationService],
  exports: [GetMyNotificationsService, MarkNotificationAsReadService, CreateNotificationService],
})
export class NotificationsModule {}
