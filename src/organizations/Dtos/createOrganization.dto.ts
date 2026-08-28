import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  userId:string;
}
