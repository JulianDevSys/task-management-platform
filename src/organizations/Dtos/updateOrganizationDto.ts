import { PartialType } from "@nestjs/mapped-types";
import { CreateOrganizationDto } from "./createOrganization.dto";

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}