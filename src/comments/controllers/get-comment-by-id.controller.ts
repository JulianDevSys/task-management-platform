import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCommentByIdService } from '../services/get-comment-by-id.service';
import { CommentResponseDto } from '../response/comment.response.dto';


@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class GetCommentByIdController {
  constructor(private readonly getCommentByIdService: GetCommentByIdService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a comment by id' })
  @ApiResponse({ status: 200, type: CommentResponseDto })
  async getCommentById(@Param('id') id: string, @Req() req: any) {
    const comment = await this.getCommentByIdService.getCommentById(id, req.user);
    return {
      message: 'Comment retrieved successfully',
      data: comment,
    };
  }
}
