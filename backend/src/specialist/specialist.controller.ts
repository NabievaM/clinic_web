import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import type { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SpecialistService } from './specialist.service';
import { Specialist } from './specialist.model';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Specialists')
@ApiBearerAuth()
@Controller('specialist')
export class SpecialistController {
  constructor(private readonly specialistService: SpecialistService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new specialist (admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiResponse({
    status: 201,
    description: 'The specialist has been successfully created.',
    type: Specialist,
  })
  @ApiResponse({ status: 400, description: 'Invalid data or missing photo' })
  async create(
    @Body() createSpecialistDto: CreateSpecialistDto,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<Specialist> {
    return this.specialistService.create(createSpecialistDto, photo);
  }

  @Get('all')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all specialists (patients and admins)' })
  @ApiResponse({
    status: 200,
    description: 'List of specialists',
    type: [Specialist],
  })
  @ApiResponse({ status: 404, description: 'No specialists found' })
  async findAll(): Promise<Specialist[]> {
    return this.specialistService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specialist by ID (patients and admins)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Specialist found',
    type: Specialist,
  })
  @ApiResponse({ status: 404, description: 'Specialist not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Specialist> {
    return this.specialistService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a specialist (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Specialist updated successfully',
    type: Specialist,
  })
  @ApiResponse({ status: 404, description: 'Specialist not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpecialistDto: UpdateSpecialistDto,
  ): Promise<Specialist> {
    return this.specialistService.update(id, updateSpecialistDto);
  }

  @Patch(':id/photo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update specialist photo (admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Specialist photo updated successfully',
    type: Specialist,
  })
  @ApiResponse({ status: 404, description: 'Specialist not found' })
  async updatePhoto(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<Specialist> {
    return this.specialistService.updatePhoto(id, photo);
  }

  @Delete(':id/photo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Remove specialist photo (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Specialist photo removed successfully',
    type: Specialist,
  })
  @ApiResponse({ status: 404, description: 'Specialist or photo not found' })
  async removePhoto(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Specialist> {
    return this.specialistService.removePhoto(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a specialist (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Specialist deleted successfully' })
  @ApiResponse({ status: 404, description: 'Specialist not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.specialistService.remove(id);
  }
}
