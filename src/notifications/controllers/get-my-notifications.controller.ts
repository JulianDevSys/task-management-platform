import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMyNotificationsService } from '../services/get-my-notifications.service';
import { NotificationResponseDto } from '../response/notification.response';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class GetMyNotificationsController {
  constructor(private readonly getMyNotificationsService: GetMyNotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get notifications for the authenticated user' })
  @ApiResponse({ status: 200, type: [NotificationResponseDto] })
  async getMyNotifications(@Req() req: any) {
    const notifications = await this.getMyNotificationsService.getMyNotifications(req.user);
    return {
      message: 'Notifications retrieved successfully',
      data: notifications,
    };
  }
}
