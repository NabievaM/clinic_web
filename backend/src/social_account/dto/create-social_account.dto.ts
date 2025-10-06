import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNotEmpty, IsUrl } from 'class-validator';
import { Platform } from '../../common/enums/platform.enum';
export class CreateSocialAccountDto {
  @ApiProperty({
    description: 'The social media platform of the clinic',
    enum: Platform,
    example: Platform.Facebook,
  })
  @IsEnum(Platform)
  @IsNotEmpty()
  platform: Platform;

  @ApiProperty({
    description: 'The URL link to the clinic’s social media account',
    example: 'https://www.facebook.com/clinicname',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  url: string;
}
