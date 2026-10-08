import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from '../services/ai.service';
import { CreateAiTaskDto } from '../dtos/create-ai-task.dto';

@Controller('ai')
export class AiController {

  constructor(
    private readonly aiService: AiService,
  ) {}

  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  async testAi(): Promise<string> {
    return this.aiService.testAi();
  }

  @Post('tasks/proposal')
  @UseGuards(AuthGuard('jwt'))
  async createTaskProposal(@Body() dto: CreateAiTaskDto) {
    return this.aiService.generateTaskProposal(dto.prompt);
  }
}