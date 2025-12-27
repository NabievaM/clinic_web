import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { User } from '../user/user.model';
import { Service } from '../service/service.model';
import { Specialist } from '../specialist/specialist.model';
import { SpecialistService } from '../specialist_service/specialist_service.model';
import { Booking } from '../booking/booking.model';
import { AnalysisResult } from '../analysis_result/analysis_result.model';
import { Banner } from '../banner/banner.model';
import { Achievement } from '../achievement/achievement.model';
import { UserMessage } from '../user_message/user_message.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Service,
      Specialist,
      SpecialistService,
      Booking,
      AnalysisResult,
      Banner,
      Achievement,
      UserMessage,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
