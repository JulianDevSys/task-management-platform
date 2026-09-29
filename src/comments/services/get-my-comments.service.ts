import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { CommentResponseDto } from '../response/comment.response';

@Injectable()
export class GetMyCommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getMyComments(authenticatedUser: { userId: string; email: string; role: string }): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { user: { id: authenticatedUser.userId } },
      relations: { user: true, task: true },
      order: { createdAt: 'ASC' },
    });

    console.log(authenticatedUser.userId ,"valor 1")

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      edited: comment.updatedAt.getTime() > comment.createdAt.getTime(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: { id: comment.user.id, name: comment.user.name },
      task: { id: comment.task.id },
    }));
  }
}
