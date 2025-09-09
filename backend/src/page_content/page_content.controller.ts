import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PageContentService } from './page_content.service';
import { CreatePageContentDto } from './dto/create-page_content.dto';
import { UpdatePageContentDto } from './dto/update-page_content.dto';
import { PageContent } from './page_content.model';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Page Content')
@Controller('page-content')
export class PageContentController {
  constructor(private readonly pageContentService: PageContentService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new page content' })
  @ApiResponse({
    status: 201,
    description: 'Page content created.',
    type: PageContent,
  })
  @ApiResponse({
    status: 400,
    description: 'Page name and content cannot be empty.',
  })
  async create(@Body() dto: CreatePageContentDto): Promise<PageContent> {
    return this.pageContentService.create(dto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve all page content entries' })
  @ApiResponse({
    status: 200,
    description: 'List of all page contents',
    type: [PageContent],
  })
  @ApiResponse({ status: 404, description: 'No page content found.' })
  async findAll(): Promise<PageContent[]> {
    return this.pageContentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve a single page content by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Page content ID' })
  @ApiResponse({
    status: 200,
    description: 'Page content retrieved.',
    type: PageContent,
  })
  @ApiResponse({ status: 404, description: 'Page content not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PageContent> {
    return this.pageContentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a page content by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Page content ID' })
  @ApiResponse({
    status: 200,
    description: 'Page content updated.',
    type: PageContent,
  })
  @ApiResponse({
    status: 400,
    description: 'Page name or content cannot be empty.',
  })
  @ApiResponse({ status: 404, description: 'Page content not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePageContentDto,
  ): Promise<PageContent> {
    return this.pageContentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a page content by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Page content ID' })
  @ApiResponse({ status: 200, description: 'Page content deleted.' })
  @ApiResponse({ status: 404, description: 'Page content not found.' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.pageContentService.remove(id);
  }
}
