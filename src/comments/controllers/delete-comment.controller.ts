import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteCommentService } from '../services/delete-comment.service';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class DeleteCommentController {
  constructor(private readonly deleteCommentService: DeleteCommentService) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  async deleteComment(@Param('id') id: string, @Req() req: any) {
    await this.deleteCommentService.deleteComment(id, req.user);
    return {
      message: 'Comment deleted successfully',
      data: null,
    };
  }
}
