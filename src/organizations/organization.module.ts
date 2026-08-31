import { Module } from "@nestjs/common";
import { GetOrganizationController } from "./controllers/getOrganization.controller";
import { GetOrganizationService } from "./services/getOrganization.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./entity/Organization.entity";
import { User } from "src/users/entity/User.entity";
import { MembersOrganization } from "src/memberOrganization/entity/memberOrganization.entity";
import { CreateOrganizationController } from "./controllers/createOrganization.controller";
import { CreateOrganizationService } from "./services/createOrganization.service";
import { GetOrganizationByIdController } from "./controllers/getOrganizationById.controller";
import { GetOrganizationByIdService } from "./services/getOrganizationById.service";
import { DeleteOrganizationController } from "./controllers/deleteOrganization.controller";
import { UpdateOrganizationController } from "./controllers/updateOrganization.controller";
import { UpdateOrganizationService } from "./services/updateOrganization.service";
import { DeleteOrganizationService } from "./services/deleteOrganization.service";

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, MembersOrganization])],
  controllers: [GetOrganizationController, GetOrganizationByIdController, DeleteOrganizationController, UpdateOrganizationController, CreateOrganizationController],
  providers:[GetOrganizationService, GetOrganizationByIdService, DeleteOrganizationService, UpdateOrganizationService, CreateOrganizationService]

})

export class OrganizationModule {}