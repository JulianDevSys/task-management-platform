import { Body, Controller, Param, Patch } from "@nestjs/common";
import { UpdateUserService } from "../services/UpdateUser.service";
import { UpdateUserDto } from "../Dtos/updateUser.dto";


@Controller('users')
export class UpdateUserController {
  constructor(
    private readonly updateUserService: UpdateUserService
  ) {}

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    const user = await this.updateUserService.updateUser(id,userData);
    return {
      message: 'User updated successfully',
      user,
    };
  }
}