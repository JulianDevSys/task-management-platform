import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from 'src/invitation/enums/invitationStatus.enum';

export class InvitationResponseDto  {
  @ApiProperty({ description: 'Unique ID of the invitation' })
  id: string;

  @ApiProperty({ description: 'ID of the organization' })
  organizationId: string;

  @ApiProperty({ description: 'Name of the organization' })
  organizationName: string;

  @ApiProperty({ description: 'ID of the invited user' })
  receiverUserId: string;

  @ApiProperty({ description: 'Name of the invited user' })
  receiverUserName: string;

  @ApiProperty({ description: 'ID of the member who sent the invitation' })
  senderMemberId: string;

  @ApiProperty({ description: 'Name of the member who sent the invitation' })
  senderMemberName: string;

  @ApiProperty({
    description: 'Current status of the invitation',
    enum: InvitationStatus,
  })
  status: InvitationStatus;

  @ApiProperty({ description: 'Date when the invitation was created' })
  createdAt: Date;

  @ApiProperty({
    description: 'Expiration date of the invitation',
    required: false,
  })
  expiresAt?: Date;
}
