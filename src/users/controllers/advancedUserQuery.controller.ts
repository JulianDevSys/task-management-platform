import { Controller, Get, Param, Query } from '@nestjs/common';
import { AdvancedUserQueryService } from '../services/advancedUserQuery.service';
import { UserTasksFiltersDto } from 'src/task/dtos/userTasksFilters.dto';

@Controller('organizations/:organizationId/users-tasks')
export class AdvancedUserQueryController {
  constructor(
    private readonly advancedUserQueryService: AdvancedUserQueryService,
  ) {}

  @Get()
  async getUsersWithTasks(
    @Param('organizationId') organizationId: string,
    @Query() filters: UserTasksFiltersDto,
  ) {
    return this.advancedUserQueryService.advancedUserQuery(
      organizationId,
      filters,
    );
  }
}
