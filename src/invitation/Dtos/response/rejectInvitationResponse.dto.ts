import { InvitationStatus } from "src/invitation/enums/invitationStatus.enum";

export class RejectInvitationResponseDto {
  id: string;
  organizationId: string;
  receiverUserId: string;
  status: InvitationStatus;
  createdAt: Date;
  rejectedAt: Date;
}
