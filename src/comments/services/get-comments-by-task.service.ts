import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { Tasks } from 'src/task/entity/task.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { CommentResponseDto } from '../response/comment.response';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class GetCommentsByTaskService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Tasks)
    private readonly taskRepository: Repository<Tasks>,
    @InjectRepository(MembersOrganization)
    private readonly memberOrganizationRepository: Repository<MembersOrganization>,
    private readonly redisService: RedisService
  ) {}

  async getCommentsByTask(
    taskId: string,
    authenticatedUser: { userId: string; email: string; role: string }
  ): Promise<CommentResponseDto[]> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
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

    const cachekeyComments = `comments:task:${taskId}`;
    // Obtener los comentarios guardados previamente en Redis.
    // Puede devolver string o null si la clave no existe.
    const cachedComments = await this.redisService.get(cachekeyComments);
    if (cachedComments) {
      // Redis guarda texto, por eso convertimos el JSON guardado
      // nuevamente a un objeto/array de TypeScript.
      return JSON.parse(cachedComments);
    }

       console.log('probando si trae MISS:', cachekeyComments);
    const comments = await this.commentRepository.find({
      where: { task: { id: taskId } },
      relations: { user: true, task: true },
      order: { createdAt: 'ASC' },
    });

    const commenstByTaskResponse = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      edited: comment.updatedAt.getTime() > comment.createdAt.getTime(),
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      user: { id: comment.user.id, name: comment.user.name },
      task: { id: comment.task.id },
    }));

    // 3. Guardar el resultado en Redis durante 60 segundos
    await this.redisService.set(
      cachekeyComments,
      JSON.stringify(commenstByTaskResponse),
      60
    );

    return commenstByTaskResponse;
  }
}
