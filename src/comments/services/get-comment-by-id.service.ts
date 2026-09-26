import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { CommentResponseDto } from '../response/comment.response';

@Injectable()
export class GetCommentByIdService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(MembersOrganization)
    private readonly memberOrganizationRepository: Repository<MembersOrganization>,
  ) {}

  async getCommentById(
    commentId: string,
    authenticatedUser: { userId: string; email: string; role: string },
  ): Promise<CommentResponseDto> {
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

    return {
      id: comment.id,
      content: comment.content,
      edited: comment.updatedAt.getTime() > comment.createdAt.getTime(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: { id: comment.user.id, name: comment.user.name },
      task: { id: comment.task.id },
    };
  }
}
