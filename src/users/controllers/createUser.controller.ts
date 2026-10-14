import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserService } from "../services/createUser.service";
import { CreateUserDto } from "../Dtos/createUser.dto";
import { ApiResponse } from "node_modules/@nestjs/swagger/dist/decorators/api-response.decorator";
import { ApiTags } from "@nestjs/swagger";
import { HidePasswordInterceptor } from "src/common/interceptors/hidePassword.interceptor";


@ApiTags('Users')
@Controller('users')
@UseInterceptors(HidePasswordInterceptor)
export class createUserController{
  constructor(
    private readonly createUserService: CreateUserService
  ) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('file', { dest: './uploads/users/profile-images' }))
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async registerUser(
    @Body() userData: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/i }),
        ],
      }),
    )
    file?: any,
  ) {
    const user = await this.createUserService.createUser(userData, file);
    return {
      message: 'User created successfully',
      user,
    };
  }

  @Post()
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async createUser(@Body() userData: CreateUserDto) {
    const user = await this.createUserService.createUser(userData);
    return {
      message: 'User created successfully',
      user,
    };
  }
}