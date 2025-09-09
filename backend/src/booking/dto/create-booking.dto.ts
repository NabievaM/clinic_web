import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsDateString, IsInt } from 'class-validator';
import { BookingStatus } from '../../common/enums/status.enum';

export class CreateBookingDto {
  @ApiProperty({ description: 'Service ID', example: 3 })
  @IsInt()
  @IsNotEmpty()
  service_id: number;

  @ApiProperty({ description: 'Specialist ID', example: 5 })
  @IsInt()
  @IsNotEmpty()
  specialist_id: number;

  @ApiProperty({
    description: 'Booking date and time',
    example: '2025-09-10T14:30:00Z',
  })
  @IsDateString()
  booking_datetime: Date;

  @ApiProperty({
    description: 'Booking status',
    enum: BookingStatus,
    example: BookingStatus.PENDING,
  })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
