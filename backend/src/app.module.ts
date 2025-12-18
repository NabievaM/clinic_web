import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { AuthModule } from './common/auth/auth.module';
import { BannerModule } from './banner/banner.module';
import { FileModule } from './file/file.module';
import { ServiceModule } from './service/service.module';
import { SpecialistModule } from './specialist/specialist.module';
import { Banner } from './banner/banner.model';
import { Service } from './service/service.model';
import { Specialist } from './specialist/specialist.model';
import { ClinicSettingModule } from './clinic_setting/clinic_setting.module';
import { ClinicSetting } from './clinic_setting/clinic_setting.model';
import { SocialAccountModule } from './social_account/social_account.module';
import { SocialAccount } from './social_account/social_account.model';
import { PageContentModule } from './page_content/page_content.module';
import { PageContent } from './page_content/page_content.model';
import { AchievementModule } from './achievement/achievement.module';
import { Achievement } from './achievement/achievement.model';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/booking.model';
import { AnalysisResultModule } from './analysis_result/analysis_result.module';
import { AnalysisResult } from './analysis_result/analysis_result.model';
import { StatisticsModule } from './statistics/statistics.module';
import { Statistics } from './statistics/statistic.model';
import { SpecialistServiceModule } from './specialist_service/specialist_service.module';
import { SpecialistService } from './specialist_service/specialist_service.model';
import { UserMessageModule } from './user_message/user_message.module';
import { UserMessage } from './user_message/user_message.model';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT!,
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASSWORD),
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Banner,
        Service,
        Specialist,
        ClinicSetting,
        SocialAccount,
        PageContent,
        Achievement,
        Booking,
        AnalysisResult,
        Statistics,
        SpecialistService,
        UserMessage,
      ],
      autoLoadModels: true,
      logging: false,
    }),
    FileModule,
    AuthModule,
    UserModule,
    BannerModule,
    ServiceModule,
    SpecialistModule,
    ClinicSettingModule,
    SocialAccountModule,
    PageContentModule,
    AchievementModule,
    BookingModule,
    AnalysisResultModule,
    StatisticsModule,
    SpecialistServiceModule,
    UserMessageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
