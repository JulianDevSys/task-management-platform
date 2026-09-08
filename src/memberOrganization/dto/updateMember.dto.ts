import { PartialType } from "@nestjs/mapped-types";
import { CreateMemberDto } from "./createMember.dto";

export class UpdateMemberDto extends PartialType(CreateMemberDto){}