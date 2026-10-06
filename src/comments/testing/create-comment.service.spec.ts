import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCommentService } from '../services/create-comment.service';
import { Comment } from '../entity/comment.entity';
import { Tasks } from 'src/task/entity/task.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { RedisService } from 'src/redis/redis.service';

describe('CreateCommentService', () => {
  let service: CreateCommentService;
  let commentRepository: any;
  let taskRepository: any;
  let memberRepository: any;

  beforeEach(async () => {
    commentRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    taskRepository = { findOne: jest.fn() };
    memberRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCommentService,
        { provide: getRepositoryToken(Comment), useValue: commentRepository },
        { provide: getRepositoryToken(Tasks), useValue: taskRepository },
        { provide: getRepositoryToken(MembersOrganization), useValue: memberRepository },
        {
          provide: RedisService,
          useValue: { delete: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<CreateCommentService>(CreateCommentService);
  });

  it('creates a comment when the task exists and the user belongs to the organization', async () => {
    taskRepository.findOne.mockResolvedValue({ id: 'task-1', organization: { id: 'org-1' } });
    memberRepository.findOne.mockResolvedValue({ id: 'membership-1' });
    commentRepository.create.mockReturnValue({ id: 'comment-1', content: 'Hello' });
    commentRepository.save.mockResolvedValue({ id: 'comment-1', content: 'Hello' });
    commentRepository.findOne.mockResolvedValue({
      id: 'comment-1',
      content: 'Hello',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      user: { id: 'user-1', name: 'Alice' },
      task: { id: 'task-1' },
    });

    const result = await service.createComment(
      { taskId: 'task-1', content: 'Hello' },
      { userId: 'user-1', email: 'alice@test.com', role: 'member' },
    );

    expect(result.content).toBe('Hello');
    expect(commentRepository.create).toHaveBeenCalledWith({
      content: 'Hello',
      task: { id: 'task-1' },
      user: { id: 'user-1' },
    });
  });

  it('rejects if task does not exist', async () => {
    taskRepository.findOne.mockResolvedValue(null);

    await expect(
      service.createComment(
        { taskId: 'missing-task', content: 'Hello' },
        { userId: 'user-1', email: 'alice@test.com', role: 'member' },
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects if the user does not belong to the organization', async () => {
    taskRepository.findOne.mockResolvedValue({ id: 'task-1', organization: { id: 'org-1' } });
    memberRepository.findOne.mockResolvedValue(null);

    await expect(
      service.createComment(
        { taskId: 'task-1', content: 'Hello' },
        { userId: 'user-2', email: 'bob@test.com', role: 'member' },
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects empty or whitespace-only content', async () => {
    await expect(
      service.createComment(
        { taskId: 'task-1', content: '   ' },
        { userId: 'user-1', email: 'alice@test.com', role: 'member' },
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
