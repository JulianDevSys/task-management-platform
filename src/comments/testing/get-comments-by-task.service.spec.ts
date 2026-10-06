import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetCommentsByTaskService } from '../services/get-comments-by-task.service';
import { Comment } from '../entity/comment.entity';
import { Tasks } from 'src/task/entity/task.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { RedisService } from 'src/redis/redis.service';

describe('GetCommentsByTaskService', () => {
  let service: GetCommentsByTaskService;
  let commentRepository: any;
  let taskRepository: any;
  let memberRepository: any;

  beforeEach(async () => {
    commentRepository = { find: jest.fn() };
    taskRepository = { findOne: jest.fn() };
    memberRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCommentsByTaskService,
        { provide: getRepositoryToken(Comment), useValue: commentRepository },
        { provide: getRepositoryToken(Tasks), useValue: taskRepository },
        { provide: getRepositoryToken(MembersOrganization), useValue: memberRepository },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<GetCommentsByTaskService>(GetCommentsByTaskService);
  });

  it('returns comments for an authorized task', async () => {
    taskRepository.findOne.mockResolvedValue({ id: 'task-1', organization: { id: 'org-1' } });
    memberRepository.findOne.mockResolvedValue({ id: 'membership-1' });
    commentRepository.find.mockResolvedValue([
      {
        id: 'comment-1',
        content: 'First',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        user: { id: 'user-1', name: 'Alice' },
        task: { id: 'task-1' },
      },
    ]);

    const result = await service.getCommentsByTask('task-1', { userId: 'user-1', email: 'alice@test.com', role: 'member' });

    expect(result).toHaveLength(1);
    expect(commentRepository.find).toHaveBeenCalledWith({
      where: { task: { id: 'task-1' } },
      relations: { user: true, task: true },
      order: { createdAt: 'ASC' },
    });
  });

  it('rejects unauthorized users', async () => {
    taskRepository.findOne.mockResolvedValue({ id: 'task-1', organization: { id: 'org-1' } });
    memberRepository.findOne.mockResolvedValue(null);

    await expect(
      service.getCommentsByTask('task-1', { userId: 'user-2', email: 'bob@test.com', role: 'member' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws when task does not exist', async () => {
    taskRepository.findOne.mockResolvedValue(null);

    await expect(
      service.getCommentsByTask('missing-task', { userId: 'user-1', email: 'alice@test.com', role: 'member' }),
    ).rejects.toThrow(NotFoundException);
  });
});
