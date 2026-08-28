import { PaginationDto } from "src/common/dtos/pagination.dto";
import { UserRole } from "../enums/user-role.enum";
import { IsEmail, IsEnum, IsIn, IsOptional, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { UserFilters } from "../enums/User-filters.enum";

export class UserFiltersDto  extends PaginationDto{

/*   @ApiProperty({
    example: 'john.doe@example.com'
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'John Doe'
  })
  @IsString()
  @IsOptional()
  name?: string; */

  @ApiProperty({
    example: 'USER'
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role value' })
  role?: UserRole;

  @IsOptional()
  @IsString()
  search?: string;


  @ApiProperty({
    example: 'name',
    description: 'Field to sort by (e.g., name, email, role)',
  })
  @IsOptional()
  @IsEnum(UserFilters, { message: 'Invalid sortBy value' })
  sortBy?: UserFilters;

  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'Invalid sortOrder value' })
  sortOrder?: 'ASC' | 'DESC';
}