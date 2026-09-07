import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "src/organizations/entity/Organization.entity";
import { MembersOrganization } from "./entity/memberOrganization.entity";
import { GetMembersOrganizationByIdController } from "./controllers/getMembersOrganizationById.controller";
import { GetMembersOrganizationByIdService } from "./services/getMembersOrganizationById.service";
import { CreateMemberController } from "./controllers/createMember.controller";
import { CreateMemberService } from "./services/createMember.service";
import { User } from "src/users/entity/User.entity";
import { DeleteMemberController } from "./controllers/deleteMemberByAdmin.controller";
import { UpdateMemberController } from "./controllers/updateMemberRole.controller";
import { DeleteMemberService } from "./services/deleteMemberByAdmin.service";
import { UpdateMemberService } from "./services/updateMemberRole.service";


@Module({
 imports: [TypeOrmModule.forFeature([Organization, MembersOrganization,User])],
  controllers: [GetMembersOrganizationByIdController,CreateMemberController, DeleteMemberController,UpdateMemberController],
  providers: [GetMembersOrganizationByIdService,CreateMemberService, DeleteMemberService, UpdateMemberService],
})
export class MembersModule {}