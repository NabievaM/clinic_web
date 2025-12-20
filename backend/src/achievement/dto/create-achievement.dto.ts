import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class CreateAchievementDto {
  @ApiProperty({
    description: 'Title of the achievement',
    example: 'Best Clinic Award 2024',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the achievement',
    example:
      'Our clinic was awarded the Best Clinic Award in 2024 for outstanding healthcare services.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Date when the achievement was received',
    example: '2024-05-20',
  })
  @IsDateString()
  achieved_date: Date;

  @ApiProperty({
    description: 'URL of the achievement image (certificate, trophy, etc.)',
    example: 'award2024.jpg',
    required: false,
  })
  @IsString()
  image: string;
}
