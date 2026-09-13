import { InvitationStatus } from "src/invitation/enums/invitationStatus.enum";

export class AcceptInvitationResponseDto {
  id: string;
  organizationId: string;
  receiverUserId: string;
  status: InvitationStatus;
  createdAt: Date;
  acceptedAt: Date;
}
