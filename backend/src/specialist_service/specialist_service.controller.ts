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

@ApiTags('specialist-services')
@Controller('specialist-service')
export class SpecialistServiceController {
  constructor(private readonly svc: SpecialistServiceService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create specialist-service mapping' })
  @ApiBody({ type: CreateSpecialistServiceDto })
  @ApiResponse({ status: 201, description: 'Mapping created', type: SSModel })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateSpecialistServiceDto) {
    return this.svc.create(dto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all specialist-service mappings' })
  findAll() {
    return this.svc.findAll();
  }

  @Get('service/:serviceId/specialists')
  @ApiOperation({ summary: 'Get specialists for a given service' })
  @ApiParam({ name: 'serviceId', type: Number })
  findByService(@Param('serviceId', ParseIntPipe) serviceId: number) {
    return this.svc.findAllByService(serviceId);
  }

  @Get('specialist/:specialistId/services')
  @ApiOperation({ summary: 'Get services for a given specialist' })
  @ApiParam({ name: 'specialistId', type: Number })
  findBySpecialist(@Param('specialistId', ParseIntPipe) specialistId: number) {
    return this.svc.findAllBySpecialist(specialistId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get mapping by id' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete mapping by id' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  @Delete('specialist/:specialistId/service/:serviceId')
  @ApiOperation({ summary: 'Delete mapping by specialist and service ids' })
  removeByPair(
    @Param('specialistId', ParseIntPipe) specialistId: number,
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ) {
    return this.svc.removeByPair(specialistId, serviceId);
  }
}
