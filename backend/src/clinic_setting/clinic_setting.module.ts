import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClinicSettingService } from './clinic_setting.service';
import { ClinicSettingController } from './clinic_setting.controller';
import { ClinicSetting } from './clinic_setting.model';
import { FileModule } from '../file/file.module';

@Module({
  imports: [SequelizeModule.forFeature([ClinicSetting]), FileModule],
  controllers: [ClinicSettingController],
  providers: [ClinicSettingService],
  exports: [ClinicSettingService],
})
export class ClinicSettingModule {}
