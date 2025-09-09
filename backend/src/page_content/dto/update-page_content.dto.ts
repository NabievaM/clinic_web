import { PartialType } from '@nestjs/swagger';
import { CreatePageContentDto } from './create-page_content.dto';

export class UpdatePageContentDto extends PartialType(CreatePageContentDto) {}
