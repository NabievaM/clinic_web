import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({
    description: 'Banner image file',
    type: 'string',
    format: 'binary',
  })
  image: any;

  @ApiProperty({
    description: 'Main title of the banner',
    example: 'Welcome to our website',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Subtitle text of the banner',
    example: 'Best deals of the season',
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    description: 'Order in which the banner should be displayed',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  display_order: number;
}
