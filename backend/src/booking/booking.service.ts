import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from './booking.model';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Role } from '../common/enums/role.enum';
import { Specialist } from '../specialist/specialist.model';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
    @InjectModel(Specialist)
    private readonly specialistModel: typeof Specialist,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: number,
  ): Promise<Booking> {
    if (
      !createBookingDto.service_id ||
      !createBookingDto.specialist_id ||
      !createBookingDto.booking_datetime
    ) {
      throw new BadRequestException(
        'Majburiy maydonlar to‘ldirilmagan! (service_id, specialist_id, booking_datetime)',
      );
    }

    return await this.bookingModel.create({
      user_id: userId,
      ...createBookingDto,
    } as any);
  }

  async findAll(): Promise<any[]> {
    const bookings = await this.bookingModel.findAll({
      include: [
        {
          association: 'user',
          attributes: ['full_name'],
        },
        {
          association: 'specialist',
          include: [
            {
              association: 'user',
              attributes: ['full_name'],
            },
          ],
        },
        {
          association: 'service', 
          attributes: ['name'],
        },
      ],
      // attributes: {
      //   exclude: ['user_id', 'specialist_id', 'service_id'], 
      // },
    });

    if (!bookings.length) {
      throw new NotFoundException('Hech qanday booking topilmadi!');
    }
    return bookings;
  }

  async findOne(id: number, currentUser: any): Promise<any> {
    const booking = await this.bookingModel.findByPk(id, {
      include: [
        {
          association: 'user',
          attributes: ['full_name'],
        },
        {
          association: 'specialist',
          include: [
            {
              association: 'user',
              attributes: ['full_name'],
            },
          ],
        },
        {
          association: 'service',
          attributes: ['name'],
        },
      ],
      attributes: {
        exclude: ['user_id', 'specialist_id', 'service_id'],
      },
    });

    if (!booking) {
      throw new NotFoundException(`ID raqami ${id} bo‘lgan booking topilmadi!`);
    }

    if (
      currentUser.role === Role.Patient &&
      booking.user_id !== currentUser.userId
    ) {
      throw new ForbiddenException(
        'Siz faqat o‘zingizga tegishli bookinglarni ko‘rishingiz mumkin!',
      );
    }

    if (currentUser.role === Role.Specialist) {
      const specialist = await this.specialistModel.findOne({
        where: { user_id: currentUser.userId },
      });

      if (!specialist || booking.specialist_id !== specialist.id) {
        throw new ForbiddenException(
          'Siz faqat sizga biriktirilgan bookinglarni ko‘rishingiz mumkin!',
        );
      }
    }

    return booking;
  }

  async update(
    id: number,
    updateBookingDto: UpdateBookingDto,
    currentUser: any,
  ): Promise<Booking> {
    const booking = await this.bookingModel.findByPk(id);
    if (!booking) {
      throw new NotFoundException(`ID raqami ${id} bo‘lgan booking topilmadi!`);
    }

    if (currentUser.role === Role.Patient) {
      if (booking.user_id !== currentUser.userId) {
        throw new ForbiddenException(
          'Siz faqat o‘zingiz yaratgan bookinglarni yangilashingiz mumkin!',
        );
      }
    }

    if (currentUser.role === Role.Specialist) {
      const specialist = await this.specialistModel.findOne({
        where: { user_id: currentUser.userId },
      });

      if (!specialist || booking.specialist_id !== specialist.id) {
        throw new ForbiddenException(
          'Siz faqat sizga biriktirilgan bookinglarni yangilashingiz mumkin!',
        );
      }
    }

    if (updateBookingDto.status) {
      updateBookingDto.status = updateBookingDto.status.trim() as any;
    }

    try {
      await booking.update(updateBookingDto);
      return booking;
    } catch (error) {
      throw new BadRequestException(
        `Booking yangilashda xatolik: ${error.message}`,
      );
    }
  }

  async remove(id: number, currentUser: any): Promise<{ message: string }> {
    const booking = await this.findOne(id, currentUser);

    await booking.destroy();
    return {
      message: `ID raqami ${id} bo‘lgan booking muvaffaqiyatli o‘chirildi!`,
    };
  }
}
