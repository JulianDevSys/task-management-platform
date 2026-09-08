import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({
    description: 'ID of the organization where the invitation belongs',
    example: 'c7a8f2d0-1234-4b56-9abc-7890def12345',
  })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({
    description: 'ID of the user who will receive the invitation',
    example: 'a1b2c3d4-5678-9abc-def0-1234567890ab',
  })
  @IsUUID()
  @IsNotEmpty()
  receiverUserId: string;
}