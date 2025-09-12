import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  Query,
  Res,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './user.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Email or phone already exists' })
  register(
    @Body() dto: SignUpUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.registration(dto, res);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email or phone' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginUserDto) {
    return this.usersService.login(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout and clear refresh token cookie' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    return this.usersService.logout(refreshToken, res);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Search users by keyword' })
  @ApiQuery({ name: 'keyword', required: true, description: 'Search term' })
  @ApiResponse({ status: 200, description: 'Users found' })
  search(@Query('keyword') keyword: string) {
    return this.usersService.search(keyword);
  }

  @Put(':id/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Patient, Role.Specialist)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<SignUpUserDto>,
    @GetUser() currentUser: any,
  ) {
    return this.usersService.update(id, dto, currentUser);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    return this.usersService
      .refreshTokenFromCookie(refreshToken)
      .then((tokens) => {
        res.cookie('refresh_token', tokens.refresh_token, {
          maxAge: 15 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return tokens;
      });
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  me(@GetUser() user: any) {
    return this.usersService.findMe(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete user by ID (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
