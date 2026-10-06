import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Attachment } from '../entity/attachment.entity';
import { Tasks } from 'src/task/entity/task.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UploadAttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,

    @InjectRepository(Tasks)
    private readonly taskRepository: Repository<Tasks>,
    private readonly redisService: RedisService,
  ) {}

  async upload(file: any, taskId: string) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      relations: {
        organization: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const attachment = this.attachmentRepository.create({
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      task,
    });

    const savedAttachment = await this.attachmentRepository.save(attachment);

    const cacheKey = `tasks:organization:${task.organization.id}`;
    await this.redisService.delete(cacheKey);

    return savedAttachment;
  }
}