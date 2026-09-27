import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentResponseDto } from '../response/comment.response';

@Injectable()
export class UpdateCommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(MembersOrganization)
    private readonly memberOrganizationRepository: Repository<MembersOrganization>,
  ) {}

  private normalizeContent(content: string): string {
    const trimmed = content.trim();

    if (!trimmed) {
      throw new BadRequestException('Comment content cannot be empty');
    }

    return trimmed;
  }

  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
    authenticatedUser: { userId: string; email: string; role: string },
  ): Promise<CommentResponseDto> {
    const content = this.normalizeContent(updateCommentDto.content);

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: { user: true, task: { organization: true } },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const membership = await this.memberOrganizationRepository.findOne({
      where: {
        userMember: { id: authenticatedUser.userId },
        organization: { id: comment.task.organization.id },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this organization');
    }

    if (comment.user.id !== authenticatedUser.userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    comment.content = content;
    const savedComment = await this.commentRepository.save(comment);
    const refreshedComment = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: { user: true, task: true },
    });

    if (!refreshedComment) {
      throw new NotFoundException('Comment not found after update');
    }

    return {
      id: refreshedComment.id,
      content: refreshedComment.content,
      edited: refreshedComment.updatedAt.getTime() > refreshedComment.createdAt.getTime(),
      createdAt: refreshedComment.createdAt,
      updatedAt: refreshedComment.updatedAt,
      user: { id: refreshedComment.user.id, name: refreshedComment.user.name },
      task: { id: refreshedComment.task.id },
    };
  }
}
