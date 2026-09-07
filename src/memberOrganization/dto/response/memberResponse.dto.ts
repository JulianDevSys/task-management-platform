import { ApiProperty } from '@nestjs/swagger';
import { MemberRole } from 'src/memberOrganization/enum/memberRole.enum';


export class MemberResponseDto {
  @ApiProperty({
    description: 'ID of the membership record',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the organization',
    example: 'org-001',
  })
  organizationId: string;

  @ApiProperty({
    description: 'Name of the organization',
    example: 'Acme Corp',
  })
  organizationName: string;

  @ApiProperty({
    description: 'ID of the user',
    example: 'user-001',
  })
  userId: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'Julian',
  })
  userName: string;

  @ApiProperty({
    description: 'Role of the user in the organization',
    example: 'member',
    enum: MemberRole,
  })
  role: MemberRole;
}
