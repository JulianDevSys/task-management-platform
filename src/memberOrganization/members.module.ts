import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "src/organizations/entity/Organization.entity";
import { MembersOrganization } from "./entity/memberOrganization.entity";
import { GetMembersOrganizationByIdController } from "./controllers/getMembersOrganizationById.controller";
import { GetMembersOrganizationByIdService } from "./services/getMembersOrganizationById.service";


@Module({
 imports: [TypeOrmModule.forFeature([Organization, MembersOrganization])],
  controllers: [GetMembersOrganizationByIdController],
  providers: [GetMembersOrganizationByIdService],
})
export class MembersModule {}