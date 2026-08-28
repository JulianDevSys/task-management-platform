import { ApiProperty } from "@nestjs/swagger";

export class OrganizationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

/*   @ApiProperty()
  creatorId: string;
 */
  @ApiProperty()
  creatorName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}