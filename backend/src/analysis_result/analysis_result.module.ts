import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnalysisResult } from './analysis_result.model';
import { Booking } from '../booking/booking.model';
import { Specialist } from '../specialist/specialist.model';
import { AnalysisResultService } from './analysis_result.service';
import { AnalysisResultController } from './analysis_result.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    SequelizeModule.forFeature([AnalysisResult, Booking, Specialist]),
    FileModule,
  ],
  controllers: [AnalysisResultController],
  providers: [AnalysisResultService],
  exports: [AnalysisResultService],
})
export class AnalysisResultModule {}
