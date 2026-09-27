import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCommentService } from '../services/update-comment.service';
import { CommentResponseDto } from '../response/comment.response.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';


@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class UpdateCommentController {
  constructor(private readonly updateCommentService: UpdateCommentService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, type: CommentResponseDto })
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: any,
  ) {
    const comment = await this.updateCommentService.updateComment(id, updateCommentDto, req.user);
    return {
      message: 'Comment updated successfully',
      data: comment,
    };
  }
}
