import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsUrl } from 'class-validator';
import { UserRole } from 'src/users/enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty({ example: '1', description: 'Unique identifier of the user' })
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@gmail.com', description: 'Email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+57 3001234567',
    description: 'Phone number with country code',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string | null;   // allow null to match entity

  @ApiProperty({
    example: 'https://avatar.com/john.png',
    description: 'Profile picture URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string | null;  // allow null to match entity

  @ApiProperty({ example: 'USER', description: 'Role of the user' })
  role: UserRole;

  @ApiProperty({
    example: '2026-07-20T18:00:00Z',
    description: 'Date when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-07-20T18:30:00Z',
    description: 'Date when the user was last updated',
  })
  updatedAt: Date;
}
