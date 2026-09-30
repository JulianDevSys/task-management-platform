import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteCommentService } from '../services/delete-comment.service';
import { Comment } from '../entity/comment.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { RedisService } from 'src/redis/redis.service';

describe('DeleteCommentService', () => {
  let service: DeleteCommentService;
  let commentRepository: any;
  let memberRepository: any;
  let redisService: any;

  beforeEach(async () => {
    commentRepository = {
      findOne: jest.fn(),
      remove: jest.fn(),
    };
    memberRepository = { findOne: jest.fn() };
    redisService = { delete: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCommentService,
        { provide: getRepositoryToken(Comment), useValue: commentRepository },
        { provide: getRepositoryToken(MembersOrganization), useValue: memberRepository },
        { provide: RedisService, useValue: redisService },
      ],
    }).compile();

    service = module.get<DeleteCommentService>(DeleteCommentService);
  });

  it('deletes an owned comment', async () => {
    commentRepository.findOne.mockResolvedValue({
      id: 'comment-1',
      content: 'Delete me',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      user: { id: 'user-1', name: 'Alice' },
      task: { id: 'task-1', organization: { id: 'org-1' } },
    });
    memberRepository.findOne.mockResolvedValue({ id: 'membership-1' });
    commentRepository.remove.mockResolvedValue(undefined);

    await expect(
      service.deleteComment('comment-1', { userId: 'user-1', email: 'alice@test.com', role: 'member' }),
    ).resolves.toBeUndefined();

    expect(redisService.delete).toHaveBeenCalledWith('comments:task:task-1');
  });

  it('rejects another user deleting the comment', async () => {
    commentRepository.findOne.mockResolvedValue({
      id: 'comment-1',
      content: 'Delete me',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      user: { id: 'user-2', name: 'Bob' },
      task: { id: 'task-1', organization: { id: 'org-1' } },
    });
    memberRepository.findOne.mockResolvedValue({ id: 'membership-1' });

    await expect(
      service.deleteComment('comment-1', { userId: 'user-1', email: 'alice@test.com', role: 'member' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws when comment does not exist', async () => {
    commentRepository.findOne.mockResolvedValue(null);

    await expect(
      service.deleteComment('missing', { userId: 'user-1', email: 'alice@test.com', role: 'member' }),
    ).rejects.toThrow(NotFoundException);
  });
});
