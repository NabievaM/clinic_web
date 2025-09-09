import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SpecialistService } from './specialist.service';
import { SpecialistController } from './specialist.controller';
import { FileModule } from '../file/file.module';
import { Specialist } from './specialist.model';

@Module({
  imports: [SequelizeModule.forFeature([Specialist]), FileModule],
  controllers: [SpecialistController],
  providers: [SpecialistService],
  exports: [SpecialistService],
})
export class SpecialistModule {}
