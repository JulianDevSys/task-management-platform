import { Controller, Get, Param } from "@nestjs/common";
import { GetUserByIdService } from "../services/GetUserById.service";

@Controller('users')
export class GetUserByIdController {
  constructor(
    private readonly getUserByIdService: GetUserByIdService
  ) {}

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    const user = await this.getUserByIdService.findUserById(id);
    return {
      message: 'User retrieved successfully',
      user,
    };
  }
}