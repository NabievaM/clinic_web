import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserMessageService } from './user_message.service';
import { UserMessage } from './user_message.model';
import { CreateUserMessageDto } from './dto/create-user_message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Contact Messages')
@Controller('user-message')
export class UserMessageController {
  constructor(private readonly userMessageService: UserMessageService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send contact message (public)' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    type: UserMessage,
  })
  async create(@Body() dto: CreateUserMessageDto): Promise<UserMessage> {
    return this.userMessageService.create(dto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all contact messages' })
  async findAll(): Promise<UserMessage[]> {
    return this.userMessageService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserMessage> {
    return this.userMessageService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.userMessageService.remove(id);
  }
}
