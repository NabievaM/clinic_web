import { PartialType } from '@nestjs/mapped-types';
import { SignUpUserDto } from './signup-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto extends PartialType(SignUpUserDto) {
  @ApiProperty({
    description: 'Eski parolni tasdiqlash',
    example: 'oldPassword123',
    required: false,
  })
  @IsString()
  @IsOptional()
  currentPassword?: string;

  @ApiProperty({
    description: 'Yangi parol',
    example: 'newStrongPassword123',
    required: false,
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Role (faqat admin o‘zgartira oladi)',
    enum: Role,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
