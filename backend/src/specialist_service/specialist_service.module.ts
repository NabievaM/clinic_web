import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { SpecialistServiceService } from './specialist_service.service';
import { SpecialistServiceController } from './specialist_service.controller';
import { SpecialistService } from './specialist_service.model';

@Module({
  imports: [SequelizeModule.forFeature([SpecialistService])],
  controllers: [SpecialistServiceController],
  providers: [SpecialistServiceService],
  exports: [SpecialistServiceService],
})
export class SpecialistServiceModule {}
