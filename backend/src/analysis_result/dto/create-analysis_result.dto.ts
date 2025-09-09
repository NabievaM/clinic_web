import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAnalysisResultDto {
  @ApiProperty({ example: 1, description: 'Booking ID' })
  @IsNumber()
  booking_id: number;

  @ApiProperty({
    example: 'file.pdf',
    description: 'PDF file',
  })
  @IsNotEmpty()
  @IsString()
  file_url: string;

  @ApiProperty({
    example: 'Blood test results',
    description: 'Description of the analysis result',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
