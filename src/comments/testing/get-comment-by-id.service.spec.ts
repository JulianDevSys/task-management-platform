import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetCommentByIdService } from '../services/get-comment-by-id.service';
import { Comment } from '../entity/comment.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';

describe('GetCommentByIdService', () => {
  let service: GetCommentByIdService;
  let commentRepository: any;
  let memberRepository: any;

  beforeEach(async () => {
    commentRepository = { findOne: jest.fn() };
    memberRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCommentByIdService,
        { provide: getRepositoryToken(Comment), useValue: commentRepository },
        { provide: getRepositoryToken(MembersOrganization), useValue: memberRepository },
      ],
    }).compile();

    service = module.get<GetCommentByIdService>(GetCommentByIdService);
  });

  it('returns an authorized comment by id', async () => {
    commentRepository.findOne.mockResolvedValue({
      id: 'comment-1',
      content: 'Need context',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      user: { id: 'user-1', name: 'Alice' },
      task: { id: 'task-1', organization: { id: 'org-1' } },
    });
    memberRepository.findOne.mockResolvedValue({ id: 'membership-1' });

    const result = await service.getCommentById('comment-1', { userId: 'user-1', email: 'alice@test.com', role: 'member' });

    expect(result.id).toBe('comment-1');
    expect(result.edited).toBe(false);
  });

  it('throws when comment does not exist', async () => {
    commentRepository.findOne.mockResolvedValue(null);

    await expect(
      service.getCommentById('missing', { userId: 'user-1', email: 'alice@test.com', role: 'member' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('rejects users outside the organization', async () => {
    commentRepository.findOne.mockResolvedValue({
      id: 'comment-1',
      content: 'Need context',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      user: { id: 'user-1', name: 'Alice' },
      task: { id: 'task-1', organization: { id: 'org-1' } },
    });
    memberRepository.findOne.mockResolvedValue(null);

    await expect(
      service.getCommentById('comment-1', { userId: 'user-2', email: 'bob@test.com', role: 'member' }),
    ).rejects.toThrow(ForbiddenException);
  });
});
