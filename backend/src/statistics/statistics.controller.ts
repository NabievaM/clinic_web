import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Statistics } from './statistic.model';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get all statistics',
    description: 'Retrieve statistics for all recorded dates.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of statistics successfully retrieved.',
    type: [Statistics],
  })
  async findAll() {
    return this.statisticsService.getAll();
  }

  @Get(':date')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Get statistics by date',
    description: 'Retrieve statistics for a specific date (YYYY-MM-DD).',
  })
  @ApiParam({
    name: 'date',
    description: 'Date in the format YYYY-MM-DD',
    example: '2025-09-09',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics for the specified date successfully retrieved.',
    type: Statistics,
  })
  @ApiResponse({
    status: 404,
    description: 'Statistics not found for the given date.',
  })
  async findOne(@Param('date') date: string) {
    return this.statisticsService.getByDate(date);
  }
}
