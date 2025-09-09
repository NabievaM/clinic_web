import { PartialType } from '@nestjs/swagger';
import { CreateClinicSettingDto } from './create-clinic_setting.dto';

export class UpdateClinicSettingDto extends PartialType(CreateClinicSettingDto) {}
