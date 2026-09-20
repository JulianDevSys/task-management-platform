import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDtoRegister {
  @ApiProperty({
    example: 'John Doe',
    type: String,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'jucastro@gmail.com',
    type: String,
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: '1234567890',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  avatarUrl?: string;

  @IsString()
  password: string;
}
