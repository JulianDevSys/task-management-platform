import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { Tasks } from 'src/task/entity/task.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CommentResponseDto } from '../response/comment.response';


@Injectable()
export class CreateCommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Tasks)
    private readonly taskRepository: Repository<Tasks>,
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

  async createComment(
    createCommentDto: CreateCommentDto,
    authenticatedUser: { userId: string; email: string; role: string },
  ): Promise<CommentResponseDto> {
    const content = this.normalizeContent(createCommentDto.content);

    const task = await this.taskRepository.findOne({
      where: { id: createCommentDto.taskId },
      relations: { organization: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const membership = await this.memberOrganizationRepository.findOne({
      where: {
        userMember: { id: authenticatedUser.userId },
        organization: { id: task.organization.id },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this organization');
    }

    const comment = this.commentRepository.create({
      content,
      task: { id: task.id },
      user: { id: authenticatedUser.userId },
    });

    const savedComment = await this.commentRepository.save(comment);
    const created = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: { user: true, task: true },
    });

    if (!created) {
      throw new NotFoundException('Comment could not be created');
    }

    return {
      id: created.id,
      content: created.content,
      edited: false,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      user: { id: created.user.id, name: created.user.name },
      task: { id: created.task.id },
    };
  }
}
