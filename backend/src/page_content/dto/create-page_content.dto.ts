import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePageContentDto {
  @ApiProperty({
    description: 'The unique name of the page',
    example: 'about-us',
  })
  @IsString()
  page_name: string;

  @ApiProperty({
    description: 'The content of the page (HTML or text)',
    example: '<h1>About our clinic</h1><p>We provide the best service...</p>',
  })
  @IsString()
  content: string;
}
