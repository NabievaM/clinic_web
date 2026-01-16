import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import type { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ClinicSettingService } from './clinic_setting.service';
import { CreateClinicSettingDto } from './dto/create-clinic_setting.dto';
import { ClinicSetting } from './clinic_setting.model';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Clinic Settings')
@ApiBearerAuth()
@Controller('clinic-setting')
export class ClinicSettingController {
  constructor(private readonly clinicSettingService: ClinicSettingService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new clinic setting (admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo_url'))
  @ApiResponse({
    status: 201,
    description: 'Clinic setting created successfully.',
    type: ClinicSetting,
  })
  @ApiResponse({ status: 400, description: 'Invalid data or missing logo' })
  create(
    @Body() dto: CreateClinicSettingDto,
    @UploadedFile() logo_url: Express.Multer.File,
  ) {
    return this.clinicSettingService.create(dto, logo_url);
  }

  @Get('all')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all clinic settings (patients and admins)' })
  @ApiResponse({
    status: 200,
    description: 'List of clinic settings',
    type: [ClinicSetting],
  })
  @ApiResponse({ status: 404, description: 'No clinic settings found' })
  findAll() {
    return this.clinicSettingService.findAll();
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get clinic setting by ID (patients and admins)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Clinic setting found',
    type: ClinicSetting,
  })
  @ApiResponse({ status: 404, description: 'Clinic setting not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clinicSettingService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update clinic setting by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Clinic setting updated successfully',
    type: ClinicSetting,
  })
  @ApiResponse({ status: 404, description: 'Clinic setting not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateClinicSettingDto,
  ) {
    return this.clinicSettingService.updateById(id, dto);
  }

  @Patch(':id/logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update clinic logo (admin only)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo_url'))
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Clinic logo updated successfully',
    type: ClinicSetting,
  })
  @ApiResponse({ status: 404, description: 'Clinic setting not found' })
  updateLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() logo_url: Express.Multer.File,
  ) {
    return this.clinicSettingService.updateLogo(id, logo_url);
  }

  @Delete(':id/logo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Remove clinic logo (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Clinic logo removed successfully' })
  @ApiResponse({ status: 404, description: 'Clinic setting not found' })
  removeLogo(@Param('id', ParseIntPipe) id: number) {
    return this.clinicSettingService.removeLogo(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete clinic setting by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Clinic setting deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Clinic setting not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clinicSettingService.remove(id);
  }
}
