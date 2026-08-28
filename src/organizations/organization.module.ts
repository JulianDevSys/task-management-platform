import { Module } from "@nestjs/common";
import { GetOrganizationController } from "./controllers/getOrganization.controller";
import { GetOrganizationService } from "./services/getOrganization.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./entity/Organization.entity";
import { User } from "src/users/entity/User.entity";
import { MembersOrganization } from "src/memberOrganization/entity/memberOrganization.entity";
import { CreateOrganizationController } from "./controllers/createOrganization.controller";
import { CreateOrganizationService } from "./services/createOrganization.service";

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, MembersOrganization])],
  controllers: [GetOrganizationController, CreateOrganizationController],
  providers:[GetOrganizationService, CreateOrganizationService]

})

export class OrganizationModule {}