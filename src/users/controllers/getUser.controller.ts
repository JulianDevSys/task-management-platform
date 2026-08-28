import { Controller, Get, Query } from "@nestjs/common";
import { GetUserService } from "../services/GetUser.service";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { ApiResponse } from "@nestjs/swagger";
import { UserResponseDto } from "../Dtos/response/userResponseDto";
import { UserFiltersDto } from "../Dtos/userFilters.dto";


@Controller('users')
export class GetUserController {
  constructor(
    private readonly getUserService: GetUserService
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: UserResponseDto, description: 'Users retrieved successfully' })
  // here i use pagination query params to get all users with pagination
  async findAllUser(@Query() userFilters: UserFiltersDto) {
    const users = await this.getUserService.findAllUser(userFilters);
    return {
      message: 'Users retrieved successfully',
      users,
    };
  }
}
