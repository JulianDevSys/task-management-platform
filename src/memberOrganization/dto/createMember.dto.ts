import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum } from 'class-validator';
import { MemberRole } from '../enum/memberRole.enum';

export class CreateMemberDto {
  @ApiProperty({
    description: 'ID of the organization where the user will be added',
    example: 'a1b2c3d4-e5f6-7890-ab12-cd34ef56ab78',
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'ID of the user who will become a member of the organization',
    example: 'b2c3d4e5-f6a7-8901-b234-c567d890e123',
  })
  @IsUUID()
  userMemberId: string;

  @ApiProperty({
    description: 'Role assigned to the user inside the organization',
    example: 'member',
    enum: MemberRole,
  })
  @IsEnum(MemberRole)
  role: MemberRole;
}
