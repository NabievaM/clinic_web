import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { Platform } from '../../common/enums/platform.enum';

export class CreateSocialAccountDto {
  @ApiProperty({
    description:
      'The social media platform of the clinic (e.g., Facebook, Instagram, Telegram)',
    enum: Platform,
    example: Platform.Facebook,
  })
  @IsEnum(Platform)
  platform: Platform;

  @ApiProperty({
    description: 'The URL link to the clinic’s social media account',
    example: 'https://www.facebook.com/clinicname',
  })
  @IsString()
  url: string;
}
