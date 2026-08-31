import { ApiProperty } from "@nestjs/swagger";
import { MemberRole } from "src/memberOrganization/enum/memberRole.enum";

export class MemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: MemberRole;
}

export class CreatorResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class ResponseGetOrganizationByIdDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: CreatorResponseDto })
  creator: CreatorResponseDto;

  @ApiProperty({ type: [MemberResponseDto] })
  members: MemberResponseDto[];

  @ApiProperty()
  membersCount: number;
}
