import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./createTask.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}