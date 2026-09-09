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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invitation,
      User,
      MembersOrganization,
      Organization,
    ]),
  ],
  controllers: [CreateInvitationController, DeleteInvitationController, GetInvitationByOrganizationController, AcceptInvitationController,RejectInvitationController],
  providers: [CreateInvitationService, DeleteInvitationService, GetInvitationByOrganizationService,AcceptInvitationService, RejectInvitationService],
})
export class InvitationModule {}
