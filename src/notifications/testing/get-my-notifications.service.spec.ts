import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetMyNotificationsService } from '../services/get-my-notifications.service';
import { Notification } from '../entity/notification.entity';

describe('GetMyNotificationsService', () => {
  let service: GetMyNotificationsService;
  let notificationRepository: { find: jest.Mock };

  beforeEach(async () => {
    notificationRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMyNotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: notificationRepository,
        },
      ],
    }).compile();

    service = module.get<GetMyNotificationsService>(GetMyNotificationsService);
  });

  it('returns notifications for the authenticated user', async () => {
    notificationRepository.find.mockResolvedValue([
      {
        id: 'notification-1',
        type: 'task_assigned',
        message: 'You were assigned to a task',
        read: false,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        user: { id: 'user-1', name: 'Alice' },
      },
    ]);

    await expect(
      service.getMyNotifications({ userId: 'user-1', email: 'alice@test.com', role: 'member' }),
    ).resolves.toEqual([
      {
        id: 'notification-1',
        type: 'task_assigned',
        message: 'You were assigned to a task',
        read: false,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        user: { id: 'user-1', name: 'Alice' },
      },
    ]);
  });

  it('returns an empty list when no notifications exist', async () => {
    notificationRepository.find.mockResolvedValue([]);

    await expect(
      service.getMyNotifications({ userId: 'user-1', email: 'alice@test.com', role: 'member' }),
    ).resolves.toEqual([]);
  });
});
