import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsUUID,
} from 'class-validator';

export class CreateSpecialistDto {
  @ApiProperty({ example: 'uuid-user-id', description: 'Related user ID' })
  @IsNotEmpty()
  @IsUUID()
  user_id: number;

  @ApiProperty({
    example: 'doctor.jpg',
    description: 'Specialist photo file name',
    type: 'string',
    format: 'binary',
  })
  photo: any;

  @ApiProperty({ example: 'Therapist', description: 'Job position' })
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty({ example: '5 years', description: 'Years of experience' })
  @IsString()
  experience_years: string;

  @ApiProperty({ example: 'Cardiology', description: 'Specialization field' })
  @IsString()
  specialization: string;

  @ApiProperty({
    example: 'Mon-Fri 09:00-18:00',
    description: 'Working days and hours (free text format)',
  })
  @IsNotEmpty()
  @IsString()
  working_days: string;

  @ApiProperty({
    example: 'active',
    description: 'Specialist status',
    enum: ['active', 'inactive'],
  })
  @IsIn(['active', 'inactive'])
  @IsOptional()
  status: string;

  @ApiProperty({
    example: 'Experienced cardiologist with 5 years of practice.',
    description: 'Description of the specialist',
  })
  @IsString()
  description: string;
}
