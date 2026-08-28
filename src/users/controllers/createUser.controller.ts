import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserService } from "../services/createUser.service";
import { CreateUserDto } from "../Dtos/createUser.dto";
import { ApiResponse } from "node_modules/@nestjs/swagger/dist/decorators/api-response.decorator";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Users')
@Controller('users')
export class createUserController{
  constructor(
    private readonly createUserService: CreateUserService
  ) {}

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