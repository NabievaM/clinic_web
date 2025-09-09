import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Teeth Cleaning',
    description: 'Name of the service',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 500.0, description: 'Price of the service' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsNumber()
  duration: number;

  @ApiProperty({
    example: 'Professional dental cleaning service',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_popular?: boolean;
}
