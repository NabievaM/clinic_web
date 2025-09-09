import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateClinicSettingDto {
  @ApiProperty({ example: 'Topraqam Clinic', description: 'Clinic name' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  readonly logo_url?: any;

  @ApiProperty({ example: '123 Main St', description: 'Clinic address' })
  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @ApiProperty({ example: '+998901234567', description: 'Clinic phone' })
  @IsNotEmpty()
  @IsString()
  readonly phone: string;

  @ApiProperty({ example: 'clinic@example.com', description: 'Clinic email' })
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({
    example: '{"mon":"9-18"}',
    description: 'Working hours in JSON',
  })
  @IsNotEmpty()
  @IsObject()
  readonly working_hours: object;

  @ApiProperty({ example: '41.311081,69.240562', description: 'Map location' })
  @IsNotEmpty()
  @IsString()
  readonly map_location: string;
}
