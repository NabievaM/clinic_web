import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { SpecialistServiceService } from './specialist_service.service';
import { CreateSpecialistServiceDto } from './dto/create-specialist_service.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { SpecialistService as SSModel } from './specialist_service.model';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('specialist-services')
@Controller('specialist-service')
export class SpecialistServiceController {
  constructor(private readonly svc: SpecialistServiceService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create specialist-service mapping' })
  @ApiBody({ type: CreateSpecialistServiceDto })
  @ApiResponse({ status: 201, description: 'Mapping created', type: SSModel })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateSpecialistServiceDto) {
    return this.svc.create(dto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all specialist-service mappings' })
  findAll() {
    return this.svc.findAll();
  }

  @Get('service/:serviceId/specialists')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get specialists for a given service' })
  @ApiParam({ name: 'serviceId', type: Number })
  findByService(@Param('serviceId', ParseIntPipe) serviceId: number) {
    return this.svc.findAllByService(serviceId);
  }

  @Get('specialist/:specialistId/services')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get services for a given specialist' })
  @ApiParam({ name: 'specialistId', type: Number })
  findBySpecialist(@Param('specialistId', ParseIntPipe) specialistId: number) {
    return this.svc.findAllBySpecialist(specialistId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get mapping by id' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete mapping by id' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  @Delete('specialist/:specialistId/service/:serviceId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete mapping by specialist and service ids' })
  removeByPair(
    @Param('specialistId', ParseIntPipe) specialistId: number,
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ) {
    return this.svc.removeByPair(specialistId, serviceId);
  }
}
