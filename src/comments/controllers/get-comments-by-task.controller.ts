import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCommentsByTaskService } from '../services/get-comments-by-task.service';
import { CommentResponseDto } from '../response/comment.response.dto';


@ApiTags('Comments')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class GetCommentsByTaskController {
  constructor(private readonly getCommentsByTaskService: GetCommentsByTaskService) {}

  @Get(':taskId/comments')
  @ApiOperation({ summary: 'Get comments for a task' })
  @ApiResponse({ status: 200, type: [CommentResponseDto] })
  async getCommentsByTask(@Param('taskId') taskId: string, @Req() req: any) {
    const comments = await this.getCommentsByTaskService.getCommentsByTask(taskId, req.user);

    return {
      message: 'Comments retrieved successfully',
      data: comments,
    };
  }
}
