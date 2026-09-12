import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './entity/invitation.entity';
import { User } from 'src/users/entity/User.entity';
import { MembersOrganization } from 'src/memberOrganization/entity/memberOrganization.entity';
import { Organization } from 'src/organizations/entity/Organization.entity';
import { CreateInvitationController } from './controllers/createInvitation.controller';
import { CreateInvitationService } from './services/createInvitation.service';
import { DeleteInvitationController } from './controllers/deleteInvitation.controller';
import { DeleteInvitationService } from './services/deleteInvitation.service';
import { GetInvitationByOrganizationService } from './services/getInvitationByOrganization.service';
import { GetInvitationByOrganizationController } from './controllers/getInvitationByOrganization.controller';
import { AcceptInvitationController } from './controllers/acceptInvitation.controller';
import { AcceptInvitationService } from './services/acceptInvitation.service';
import { RejectInvitationService } from './services/rejectInvitation.service';
import { RejectInvitationController } from './controllers/rejectInvitation.controller';
import { ExpireInvitationService } from './services/expireInvitation.service';
import { ExpireInvitationController } from './controllers/expireInvitation.controller';
import { AcceptJoinRequestController } from './controllers/acceptJoinRequest.controller';
import { RejectJoinRequestController } from './controllers/rejectJoinRequest.controller';
import { CreateJoinRequestController } from './controllers/createJoinReques.controller';
import { RejectJoinRequestService } from './services/rejectJoinRequest.service';
import { CreateJoinRequestService } from './services/createJoinRequest.service';
import { AcceptJoinRequestService } from './services/aceptJoinRequest.service';
import { advancedInvitationsQueryController } from './controllers/advancedInvitationsQuery.controller';
import { AdvancedInvitationsQueryService } from './services/advancedInvitationsQuery.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invitation,
      User,
      MembersOrganization,
      Organization,
    ]),
  ],
  controllers: [
    CreateInvitationController,
    DeleteInvitationController,
    GetInvitationByOrganizationController,
    AcceptInvitationController,
    RejectInvitationController,
    ExpireInvitationController,
    AcceptJoinRequestController,
    RejectJoinRequestController,
    CreateJoinRequestController,
    advancedInvitationsQueryController
  ],
  providers: [
    CreateInvitationService,
    DeleteInvitationService,
    GetInvitationByOrganizationService,
    AcceptInvitationService,
    RejectInvitationService,
    ExpireInvitationService,
    AcceptJoinRequestService,
    RejectJoinRequestService,
    CreateJoinRequestService,
    AdvancedInvitationsQueryService
  ],
})
export class InvitationModule {}
