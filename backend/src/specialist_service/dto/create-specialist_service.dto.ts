import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecialistServiceDto {
  @ApiProperty({ description: 'Specialist id', example: 1 })
  @IsNumber()
  specialist_id: number;

  @ApiProperty({ description: 'Service id', example: 2 })
  @IsNumber()
  service_id: number;
}
