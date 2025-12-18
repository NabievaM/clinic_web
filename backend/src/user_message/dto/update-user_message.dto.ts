import { PartialType } from '@nestjs/swagger';
import { CreateUserMessageDto } from './create-user_message.dto';

export class UpdateUserMessageDto extends PartialType(CreateUserMessageDto) {}
