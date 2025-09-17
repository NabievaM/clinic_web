import { PartialType } from '@nestjs/swagger';
import { CreateSpecialistServiceDto } from './create-specialist_service.dto';

export class UpdateSpecialistServiceDto extends PartialType(CreateSpecialistServiceDto) {}
