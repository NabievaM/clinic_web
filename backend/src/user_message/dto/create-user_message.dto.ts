import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserMessageDto {
  @ApiProperty({
    description: 'Sender full name',
    example: 'Ali Valiyev',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Sender phone number',
    example: '+998901234567',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Message content',
    example:
      'I would like to provide information about the clinic`s working hours.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
