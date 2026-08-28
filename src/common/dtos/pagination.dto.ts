import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive } from "class-validator";


export class PaginationDto {
  @ApiProperty({
    example: 1,
    description: 'The page number to retrieve',
    required: false,
  })
  @IsPositive()
  @IsNumber()
  page: number = 1;

  @ApiProperty({
    example: 10,
    description: 'The number of items per page',  
  required: false,
  })
  @IsPositive()
  @IsNumber()
  limit: number = 10;
}