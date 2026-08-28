import { Controller, Delete, Param } from "@nestjs/common";
import { DeleteUserService } from "../services/deleteUser.service";
import { ApiResponse } from "@nestjs/swagger";


@Controller('users')
export class DeleteUserController {
  constructor(
    private readonly deleteUserService: DeleteUserService
  ) {}

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string) {
    const user= await this.deleteUserService.deleteUser(id);
    return {
      message: 'User deleted successfully',
      user,
    };
  }
}