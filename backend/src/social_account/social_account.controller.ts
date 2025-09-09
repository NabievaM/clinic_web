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
  @ApiResponse({
    status: 201,
    description: 'The social account has been successfully created.',
    type: SocialAccount,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The URL field cannot be empty.',
  })
  async create(@Body() dto: CreateSocialAccountDto): Promise<SocialAccount> {
    return this.socialAccountService.create(dto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve all social accounts' })
  @ApiResponse({
    status: 200,
    description: 'List of all social accounts',
    type: [SocialAccount],
  })
  @ApiResponse({
    status: 404,
    description: 'No social accounts found.',
  })
  async findAll(): Promise<SocialAccount[]> {
    return this.socialAccountService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve a single social account by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Social account ID' })
  @ApiResponse({
    status: 200,
    description: 'The social account has been successfully retrieved.',
    type: SocialAccount,
  })
  @ApiResponse({
    status: 404,
    description: 'Social account not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SocialAccount> {
    return this.socialAccountService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a social account by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Social account ID' })
  @ApiResponse({
    status: 200,
    description: 'The social account has been successfully updated.',
    type: SocialAccount,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The URL field cannot be empty.',
  })
  @ApiResponse({
    status: 404,
    description: 'Social account not found.',
  })
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
  @ApiParam({ name: 'id', type: Number, description: 'Social account ID' })
  @ApiResponse({
    status: 200,
    description: 'The social account has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Social account not found.',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.socialAccountService.remove(id);
  }
}
