import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCommentService } from '../services/create-comment.service';
import { CommentResponseDto } from '../response/comment.response.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtUser } from 'src/auth/interfaces/jwt-user.interface';


@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CreateCommentController {
  constructor(private readonly createCommentService: CreateCommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a comment on a task' })
  @ApiResponse({ status: 201, type: CommentResponseDto })
  async createComment(@Body() createCommentDto: CreateCommentDto,  @CurrentUser() user: JwtUser,) {
    const comment = await this.createCommentService.createComment(createCommentDto, user);
    return {
      message: 'Comment created successfully',
      data: comment,
    };
  }
}
