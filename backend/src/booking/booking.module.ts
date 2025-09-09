import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './booking.model';
import { User } from '../user/user.model';
import { Service } from '../service/service.model';
import { Specialist } from '../specialist/specialist.model';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [SequelizeModule.forFeature([Booking, User, Service, Specialist])],
  providers: [BookingService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule {}
  