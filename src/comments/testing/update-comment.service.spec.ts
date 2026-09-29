import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateCommentService } from '../services/update-comment.service';
import { Comment } from '../entity/comment.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';

describe('UpdateCommentService', () => {
  let service: UpdateCommentService;
  let commentRepository: any;
  let memberRepository: any;

  beforeEach(async () => {
    commentRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    memberRepository = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCommentService,
        { provide: getRepositoryToken(Comment), useValue: commentRepository },
        { provide: getRepositoryToken(MembersOrganization), useValue: memberRepository },
      ],
    }).compile();

    service = module.get<UpdateCommentService>(UpdateCommentService);
  });

  it('updates an owned comment', async () => {
    commentRepository.findOne
      .mockResolvedValueOnce({
        id: 'comment-1',
        content: 'Old',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        user: { id: 'user-1', name: 'Alice' },
        task: { id: 'task-1', organization: { id: 'org-1' } },
      })
      .mockResolvedValueOnce({
        id: 'comment-1',
        content: 'Updated',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-02T00:00:00Z'),
        user: { id: 'user-1', name: 'Alice' },
        task: { id: 'task-1' },
      });
    memberRepository.findOne.mockResolvedValue({ id: 'membership-1' });
    commentRepository.save.mockResolvedValue({
      id: 'comment-1',
      content: 'Updated',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
      user: { id: 'user-1', name: 'Alice' },
      task: { id: 'task-1' },
    });

    const result = await service.updateComment(
      'comment-1',
      { content: 'Updated' },
      { userId: 'user-1', email: 'alice@test.com', role: 'member' },
    );

    expect(result.content).toBe('Updated');
  });

  it('rejects another user updating the comment', async () => {
    commentRepository.findOne.mockResolvedValue({
      id: 'comment-1',
      content: 'Old',
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-01T00:00:00Z'),
      user: { id: 'user-2', name: 'Bob' },
      task: { id: 'task-1', organization: { id: 'org-1' } },
    });
    memberRepository.findOne.mockResolvedValue({ id: 'membership-1' });

    await expect(
      service.updateComment(
        'comment-1',
        { content: 'Updated' },
        { userId: 'user-1', email: 'alice@test.com', role: 'member' },
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('validates content', async () => {
    await expect(
      service.updateComment(
        'comment-1',
        { content: '   ' },
        { userId: 'user-1', email: 'alice@test.com', role: 'member' },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws when comment is not found', async () => {
    commentRepository.findOne.mockResolvedValue(null);

    await expect(
      service.updateComment(
        'missing',
        { content: 'Updated' },
        { userId: 'user-1', email: 'alice@test.com', role: 'member' },
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
