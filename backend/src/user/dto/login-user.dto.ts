import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address of the user (optional if phone is provided)',
    example: 'john@example.com',
    required: false,
  })
  @ValidateIf((o) => !o.phone)
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Phone number of the user (optional if email is provided)',
    example: '+998901234567',
    required: false,
  })
  @ValidateIf((o) => !o.email)
  @IsPhoneNumber('UZ')
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Password for account access',
    example: 'strongPassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
