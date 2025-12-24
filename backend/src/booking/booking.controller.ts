import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Booking')
@Controller('booking')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, type: Booking })
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: any,
  ): Promise<Booking> {
    return this.bookingService.create(createBookingDto, req.user.userId);
  }

  @Get('all')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Retrieve all bookings (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all bookings.',
    type: [Booking],
  })
  async findAll(): Promise<Booking[]> {
    return this.bookingService.findAll();
  }

  @Get('/specialist/bookings/all')
  @Roles(Role.Specialist)
  @ApiOperation({ summary: 'Get all bookings for current specialist' })
  async findAllForSpecialist(@Request() req: any) {
    return this.bookingService.findAllForSpecialist(req.user);
  }

  @Get('/patient/bookings/all')
  @Roles(Role.Patient)
  @ApiOperation({ summary: 'Get all bookings for current patient' })
  async findAllForPatient(@Request() req: any) {
    return this.bookingService.findAllForPatient(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Details of the booking.',
    type: Booking,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<Booking> {
    return this.bookingService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully updated.',
    type: Booking,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req: any,
  ): Promise<Booking> {
    return this.bookingService.update(id, updateBookingDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a booking by ID (Admin)' })
  @ApiParam({ name: 'id', type: Number, description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully deleted.',
    schema: {
      example: { message: 'Booking with ID 1 successfully deleted' },
    },
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ): Promise<{ message: string }> {
    return this.bookingService.remove(id, req.user);
  }
}
