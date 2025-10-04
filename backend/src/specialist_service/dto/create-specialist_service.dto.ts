import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecialistServiceDto {
  @ApiProperty({ description: 'Specialist id', example: 1 })
  @Type(() => Number)
  @IsNumber()
  specialist_id: number;

  @ApiProperty({ description: 'Service id', example: 2 })
  @Type(() => Number)
  @IsNumber()
  service_id: number;
}
