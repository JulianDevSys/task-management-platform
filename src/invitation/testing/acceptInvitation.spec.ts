import { NotFoundException } from '@nestjs/common';
import { AcceptInvitationService } from '../services/acceptInvitation.service';

describe('AcceptInvitationService', () => {
  let mockAcceptInvitation;
  let mockDataSource;
  let service: AcceptInvitationService; //service va a contener una instancia de AcceptInvitationService

  beforeEach(() => {
    mockAcceptInvitation = {
      findOne: jest.fn(),
    };

    mockDataSource = {
      createQueryRunner: jest.fn(),
    };
    //Creo el servicio real usando mis mocks como dependencias
    service = new AcceptInvitationService(
      mockAcceptInvitation,
      mockDataSource as any
    );
  });
  it('should reject when no pending invitation exists for the organization', async () => {
    mockAcceptInvitation.findOne.mockResolvedValue(null);

    await expect(
      service.acceptInvitation('inv123', 'receive123', 'organi123')
    ).rejects.toThrow(NotFoundException);

    // The lookup must scope the invitation to the requested organization and valid statuses.
    expect(mockAcceptInvitation.findOne).toHaveBeenCalledWith({
      where: expect.objectContaining({
        id: 'inv123',
        organization: { id: 'organi123' },
        status: expect.anything(),
      }),
      relations: { receiverUser: true, organization: true },
    });
  });
});
