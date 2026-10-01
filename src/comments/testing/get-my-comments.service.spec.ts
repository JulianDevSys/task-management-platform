import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetMyCommentsService } from '../services/get-my-comments.service';
import { Comment } from '../entity/comment.entity';

describe('GetMyCommentsService', () => {
  let service: GetMyCommentsService;
  let commentRepository: any;

  beforeEach(async () => {
    commentRepository = { find: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMyCommentsService,
        { provide: getRepositoryToken(Comment), useValue: commentRepository },
      ],
    }).compile();

    service = module.get<GetMyCommentsService>(GetMyCommentsService);
  });

  it('returns only the authenticated user comments', async () => {
    commentRepository.find.mockResolvedValue([
      {
        id: 'comment-1',
        content: 'Mine',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
        user: { id: 'user-1', name: 'Alice' },
        task: { id: 'task-1' },
      },
    ]);

    const result = await service.getMyComments({ userId: 'user-1', email: 'alice@test.com', role: 'member' });

    expect(result).toHaveLength(1);
    expect(result[0].user.id).toBe('user-1');
  });
});
