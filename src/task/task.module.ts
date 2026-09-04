import { Module } from "@nestjs/common";
import { CreateTaskService } from "./services/createTask.service";
import { Organization } from "src/organizations/entity/Organization.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MembersOrganization } from "src/memberOrganization/entity/memberOrganization.entity";
import { Tasks } from "./entity/task.entity";
import { CreateTaskController } from "./controllers/createTask.controller";
import { GetTaskController } from "./controllers/getTask.controller";
import { GetTaskService } from "./services/getTask.service";

@Module({
  imports: [TypeOrmModule.forFeature([Organization, MembersOrganization,Tasks])],
  controllers: [CreateTaskController, GetTaskController],
  providers: [CreateTaskService, GetTaskService],
})
export class TaskModule {}