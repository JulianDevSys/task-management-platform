import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteMemberDto {
  @ApiProperty({
    description: 'ID of the organization from which the member will be removed',
    example: 'a1b2c3d4-e5f6-7890-ab12-cd34ef56ab78',
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'ID of the user who will be removed from the organization',
    example: 'b2c3d4e5-f6a7-8901-b234-c567d890e123',
  })
  @IsUUID()
  userMemberId: string;
}
