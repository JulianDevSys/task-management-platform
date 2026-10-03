import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarkNotificationAsReadDto } from '../dto/mark-notification-read.dto';
import { MarkNotificationAsReadService } from '../services/mark-notification-as-read.service';
import { NotificationResponseDto } from '../response/notification.response';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class MarkNotificationAsReadController {
  constructor(private readonly markNotificationAsReadService: MarkNotificationAsReadService) {}

  @Patch(':notificationId/read')
  @ApiOperation({ summary: 'Mark a notification as read for the authenticated user' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  async markNotificationAsRead(
    @Param('notificationId') notificationId: string,
    @Body() markNotificationAsReadDto: MarkNotificationAsReadDto,
    @Req() req: any,
  ) {
    const notification = await this.markNotificationAsReadService.markNotificationAsRead(
      notificationId,
      req.user,
      markNotificationAsReadDto.read,
    );

    return {
      message: 'Notification updated successfully',
      data: notification,
    };
  }
}
