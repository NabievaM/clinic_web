import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AnalysisResultService } from './analysis_result.service';
import { AnalysisResult } from './analysis_result.model';
import { CreateAnalysisResultDto } from './dto/create-analysis_result.dto';
import { UpdateAnalysisResultDto } from './dto/update-analysis_result.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Analysis Results')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analysis-result')
export class AnalysisResultController {
  constructor(private readonly analysisService: AnalysisResultService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new analysis result' })
  @ApiResponse({
    status: 201,
    description: 'Analysis result created successfully',
    type: AnalysisResult,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file_url'))
  @ApiBody({
    description: 'Upload analysis result with file',
    type: CreateAnalysisResultDto,
  })
  async create(
    @Body() dto: CreateAnalysisResultDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<AnalysisResult> {
    return this.analysisService.create(dto, file, req.user);
  }

  @Get('all')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all analysis results (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of analysis results',
    type: [AnalysisResult],
  })
  async findAll(): Promise<AnalysisResult[]> {
    return this.analysisService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an analysis result by ID' })
  @ApiResponse({
    status: 200,
    description: 'Analysis result found',
    type: AnalysisResult,
  })
  @ApiResponse({ status: 404, description: 'Analysis result not found' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<AnalysisResult> {
    return this.analysisService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an analysis result by ID' })
  @ApiResponse({
    status: 200,
    description: 'Analysis result updated successfully',
    type: AnalysisResult,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Analysis result not found' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file_url'))
  @ApiBody({
    description: 'Update analysis result with optional file',
    type: UpdateAnalysisResultDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAnalysisResultDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ): Promise<AnalysisResult> {
    return this.analysisService.update(id, dto, file, req.user);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete an analysis result by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Analysis result deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Analysis result not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<{ message: string }> {
    return this.analysisService.remove(id, req.user);
  }
}
