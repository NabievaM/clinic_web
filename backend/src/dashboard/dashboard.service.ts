import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../user/user.model';
import { Service } from '../service/service.model';
import { Specialist } from '../specialist/specialist.model';
import { SpecialistService } from '../specialist_service/specialist_service.model';
import { Booking } from '../booking/booking.model';
import { AnalysisResult } from '../analysis_result/analysis_result.model';
import { Banner } from '../banner/banner.model';
import { Achievement } from '../achievement/achievement.model';
import { UserMessage } from '../user_message/user_message.model';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Service) private serviceModel: typeof Service,
    @InjectModel(Specialist) private specialistModel: typeof Specialist,
    @InjectModel(SpecialistService)
    private specServiceModel: typeof SpecialistService,
    @InjectModel(Booking) private bookingModel: typeof Booking,
    @InjectModel(AnalysisResult)
    private analysisResultModel: typeof AnalysisResult,
    @InjectModel(Banner) private bannerModel: typeof Banner,
    @InjectModel(Achievement) private achievementModel: typeof Achievement,
    @InjectModel(UserMessage) private messageModel: typeof UserMessage,
  ) {}

  async summary() {
    const [
      users,
      services,
      specialists,
      specServices,
      totalBookings,
      cancelledBookings,
      analysisResult,
      banners,
      achievements,
      messages,
    ] = await Promise.all([
      this.userModel.count(),
      this.serviceModel.count(),
      this.specialistModel.count(),
      this.specServiceModel.count(),
      this.bookingModel.count(),
      this.bookingModel.count({
        where: { status: 'cancelled' },
      }),
      this.analysisResultModel.count(),
      this.bannerModel.count(),
      this.achievementModel.count(),
      this.messageModel.count(),
    ]);

    return {
      users,
      services,
      specialists,
      specServices,
      bookings: {
        total: totalBookings,
        cancelled: cancelledBookings,
      },
      analysisResult,
      banners,
      achievements,
      messages,
    };
  }
}
