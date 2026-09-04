import { Module } from "@nestjs/common";
import { CreateTaskService } from "./services/createTask.service";
import { Organization } from "src/organizations/entity/Organization.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MembersOrganization } from "src/memberOrganization/entity/memberOrganization.entity";
import { Tasks } from "./entity/task.entity";
import { CreateTaskController } from "./controllers/createTask.controller";
import { GetTaskController } from "./controllers/getTask.controller";
import { GetTaskService } from "./services/getTask.service";
import { GetTaskByIdController } from "./controllers/getTaskById.controller";
import { DeleteTaskController } from "./controllers/deleteTask.controller";
import { UpdateTaskController } from "./controllers/updateTask.controller";
import { GetTaskByIdService } from "./services/getTaskById.service";
import { DeleteTaskService } from "./services/deleteTask.service";
import { UpdateTaskService } from "./services/updateTask.service";

@Module({
  imports: [TypeOrmModule.forFeature([Organization, MembersOrganization,Tasks])],
  controllers: [CreateTaskController, GetTaskController, GetTaskByIdController, DeleteTaskController, UpdateTaskController],
  providers: [CreateTaskService, GetTaskService, GetTaskByIdService, DeleteTaskService,UpdateTaskService],
})
export class TaskModule {}