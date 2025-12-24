import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SocialAccountService } from './social_account.service';
import { CreateSocialAccountDto } from './dto/create-social_account.dto';
import { UpdateSocialAccountDto } from './dto/update-social_account.dto';
import { SocialAccount } from './social_account.model';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
@ApiTags('Social Accounts')
@Controller('social-account')
export class SocialAccountController {
  constructor(private readonly socialAccountService: SocialAccountService) {}
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new social account' })
  @ApiResponse({ status: 201, description: 'Created', type: SocialAccount })
  async create(@Body() dto: CreateSocialAccountDto): Promise<SocialAccount> {
    return this.socialAccountService.create(dto);
  }
  @Get('all')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve all social accounts' })
  @ApiResponse({
    status: 200,
    description: 'List of all social accounts',
    type: [SocialAccount],
  })
  async findAll(): Promise<SocialAccount[]> {
    return this.socialAccountService.findAll();
  }
  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve a single social account by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'The social account has been successfully retrieved.',
    type: SocialAccount,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SocialAccount> {
    return this.socialAccountService.findOne(id);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a social account by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Updated', type: SocialAccount })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSocialAccountDto,
  ): Promise<SocialAccount> {
    return this.socialAccountService.update(id, dto);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a social account by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Deleted' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.socialAccountService.remove(id);
  }
}
