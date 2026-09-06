import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "src/organizations/entity/Organization.entity";
import { MembersOrganization } from "./entity/memberOrganization.entity";
import { GetMembersOrganizationByIdController } from "./controllers/getMembersOrganizationById.controller";
import { GetMembersOrganizationByIdService } from "./services/getMembersOrganizationById.service";
import { CreateMemberController } from "./controllers/createMember.controller";
import { CreateMemberService } from "./services/createMember.service";
import { User } from "src/users/entity/User.entity";


@Module({
 imports: [TypeOrmModule.forFeature([Organization, MembersOrganization,User])],
  controllers: [GetMembersOrganizationByIdController,CreateMemberController],
  providers: [GetMembersOrganizationByIdService,CreateMemberService],
})
export class MembersModule {}