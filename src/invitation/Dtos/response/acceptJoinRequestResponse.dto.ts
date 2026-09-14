
import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from 'src/invitation/enums/invitationStatus.enum';

export class AcceptJoinRequestResponseDto {
  @ApiProperty()
  id: string; 

  @ApiProperty()
  organizationId: string; 

  @ApiProperty()
  organizationName: string; 

  @ApiProperty()
  requestedByUserId: string; 
  @ApiProperty()
  requestedByUserName: string; 

  @ApiProperty({ enum: InvitationStatus })
  status: InvitationStatus;

  @ApiProperty()
  createdAt: Date; 

  @ApiProperty()
  acceptedAt: Date;
}
