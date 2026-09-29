import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMyCommentsService } from '../services/get-my-comments.service';
import { CommentResponseDto } from '../response/comment.response.dto';


@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class GetMyCommentsController {
  constructor(private readonly getMyCommentsService: GetMyCommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get comments created by the authenticated user' })
  @ApiResponse({ status: 200, type: [CommentResponseDto] })
  async getMyComments(@Req() req: any) {
    console.log('Authenticated user:', req.user);
    const comments = await this.getMyCommentsService.getMyComments(req.user);
    return {
      message: 'Comments retrieved successfully',
      data: comments,
    };
  }
}
