import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class DeleteCommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(MembersOrganization)
    private readonly memberOrganizationRepository: Repository<MembersOrganization>,
    private readonly redisService: RedisService,
  ) {}

  async deleteComment(
    commentId: string,
    authenticatedUser: { userId: string; email: string; role: string },
  ): Promise<void> {
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
      throw new ForbiddenException('You can only delete your own comments');
    }

    const taskId = comment.task.id;

    await this.commentRepository.remove(comment);
    await this.redisService.delete(`comments:task:${taskId}`);
  }
}
