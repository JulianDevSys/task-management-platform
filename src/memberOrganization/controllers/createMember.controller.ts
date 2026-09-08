import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateMemberService } from '../services/createMember.service';
import { CreateMemberDto } from '../dto/createMember.dto';

@Controller('member')
export class CreateMemberController {
  constructor(private readonly createMemberService: CreateMemberService) {}

  @Post('/:userId')
  async createMember(
    @Param('userId') userId: string,
    @Body() createMemberDto: CreateMemberDto
  ) {
    const response = await this.createMemberService.createMember(
      userId,
      createMemberDto
    );
    return {
      meessage: 'member created correctly',
      response,
    };
  }
}
