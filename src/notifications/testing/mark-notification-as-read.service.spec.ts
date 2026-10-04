import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { MarkNotificationAsReadService } from '../services/mark-notification-as-read.service';
import { Notification } from '../entity/notification.entity';

describe('MarkNotificationAsReadService', () => {
  let service: MarkNotificationAsReadService;
  let notificationRepository: { findOne: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    notificationRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarkNotificationAsReadService,
        {
          provide: getRepositoryToken(Notification),
          useValue: notificationRepository,
        },
      ],
    }).compile();

    service = module.get<MarkNotificationAsReadService>(MarkNotificationAsReadService);
  });

  it('marks a notification as read when it belongs to the authenticated user', async () => {
    notificationRepository.findOne.mockResolvedValue({
      id: 'notification-1',
      type: 'task_assigned',
      message: 'You were assigned to a task',
      read: false,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      user: { id: 'user-1', name: 'Alice' },
    });

    notificationRepository.save.mockResolvedValue({
      id: 'notification-1',
      type: 'task_assigned',
      message: 'You were assigned to a task',
      read: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      user: { id: 'user-1', name: 'Alice' },
    });

    await expect(
      service.markNotificationAsRead(
        'notification-1',
        { userId: 'user-1', email: 'alice@test.com', role: 'member' },
        true,
      ),
    ).resolves.toEqual({
      id: 'notification-1',
      type: 'task_assigned',
      message: 'You were assigned to a task',
      read: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      user: { id: 'user-1', name: 'Alice' },
    });
  });

  it('throws when the notification belongs to another user', async () => {
    notificationRepository.findOne.mockResolvedValue({
      id: 'notification-1',
      type: 'task_assigned',
      message: 'You were assigned to a task',
      read: false,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      user: { id: 'user-2', name: 'Bob' },
    });

    await expect(
      service.markNotificationAsRead(
        'notification-1',
        { userId: 'user-1', email: 'alice@test.com', role: 'member' },
        true,
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws when notification does not exist', async () => {
    notificationRepository.findOne.mockResolvedValue(null);

    await expect(
      service.markNotificationAsRead(
        'missing-notification',
        { userId: 'user-1', email: 'alice@test.com', role: 'member' },
        true,
      ),
    ).rejects.toThrow(NotFoundException);
  });
});
