import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AnalysisResult } from './analysis_result.model';
import { CreateAnalysisResultDto } from './dto/create-analysis_result.dto';
import { UpdateAnalysisResultDto } from './dto/update-analysis_result.dto';
import { Booking } from '../booking/booking.model';
import { Specialist } from '../specialist/specialist.model';
import { Role } from '../common/enums/role.enum';
import { FilesService } from '../file/file.service';

@Injectable()
export class AnalysisResultService {
  constructor(
    @InjectModel(AnalysisResult)
    private readonly analysisModel: typeof AnalysisResult,
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
    @InjectModel(Specialist)
    private readonly specialistModel: typeof Specialist,
    private readonly fileService: FilesService,
  ) {}

  async create(
    dto: CreateAnalysisResultDto,
    file_url: Express.Multer.File,
    currentUser: any,
  ): Promise<AnalysisResult> {
    if (!dto.booking_id || !file_url) {
      throw new BadRequestException(
        'Majburiy maydonlar to‘ldirilmagan! (booking_id, file)',
      );
    }

    if (currentUser.role === Role.Patient) {
      throw new ForbiddenException('Patient analysis result yaratolmaydi!');
    }

    const booking = await this.bookingModel.findByPk(dto.booking_id);
    if (!booking) {
      throw new NotFoundException(
        `ID raqami ${dto.booking_id} bo‘lgan bron topilmadi!`,
      );
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestException(
        'Bekor qilingan bron uchun analiz natijasi yuklab bo‘lmaydi!',
      );
    }

    if (currentUser.role === Role.Specialist) {
      const specialist = await this.specialistModel.findOne({
        where: { user_id: currentUser.userId },
      });

      if (!specialist || booking.specialist_id !== specialist.id) {
        throw new ForbiddenException(
          'Siz faqat sizga biriktirilgan bronlarga analysis result qo‘shishingiz mumkin!',
        );
      }
    }

    const fileName = await this.fileService.createFile(file_url);

    return this.analysisModel.create({
      ...dto,
      file_url: fileName,
    } as any);
  }

  async findAll(): Promise<AnalysisResult[]> {
    return this.analysisModel.findAll();
  }

  async findAllForSpecialist(currentUser: any) {
    if (currentUser.role !== Role.Specialist) {
      throw new ForbiddenException('Faqat mutaxassislar uchun');
    }

    const specialist = await this.specialistModel.findOne({
      where: { user_id: currentUser.userId },
    });

    if (!specialist) {
      throw new NotFoundException('Mutaxassis topilmadi');
    }

    return this.analysisModel.findAll({
      include: [
        {
          model: Booking,
          where: { specialist_id: specialist.id },
          attributes: ['id', 'status'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findAllForPatient(currentUser: any) {
    if (currentUser.role !== Role.Patient) {
      throw new ForbiddenException('Faqat bemorlar uchun');
    }

    return this.analysisModel.findAll({
      include: [
        {
          model: Booking,
          where: { user_id: currentUser.userId },
          attributes: [],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number, currentUser: any): Promise<AnalysisResult> {
    const result = await this.analysisModel.findByPk(id);
    if (!result) {
      throw new NotFoundException(
        `ID ${id} bo‘lgan analiz natijasi topilmadi!`,
      );
    }

    const booking = await this.bookingModel.findByPk(result.booking_id);
    if (!booking) {
      throw new NotFoundException(
        `ID ${result.booking_id} bo‘lgan bron topilmadi!`,
      );
    }

    if (
      currentUser.role === Role.Patient &&
      booking.user_id !== currentUser.userId
    ) {
      throw new ForbiddenException(
        'Siz faqat o‘zingizning natijangizni ko‘ra olasiz!',
      );
    }

    if (currentUser.role === Role.Specialist) {
      const specialist = await this.specialistModel.findOne({
        where: { user_id: currentUser.userId },
      });
      if (!specialist || booking.specialist_id !== specialist.id) {
        throw new ForbiddenException('Bu natija sizga tegishli emas!');
      }
    }

    return result;
  }

  async update(
    id: number,
    dto: UpdateAnalysisResultDto,
    file_url: Express.Multer.File,
    currentUser: any,
  ): Promise<AnalysisResult> {
    const result = await this.analysisModel.findByPk(id);

    if (!result) {
      throw new NotFoundException(
        `ID raqami ${id} bo‘lgan analiz natijasi topilmadi!`,
      );
    }

    const booking = await this.bookingModel.findByPk(result.booking_id);
    if (!booking) {
      throw new NotFoundException(
        `ID raqami ${result.booking_id} bo‘lgan bron topilmadi!`,
      );
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestException(
        'Bekor qilingan brondagi analiz natijasini tahrirlab bo‘lmaydi!',
      );
    }

    if (currentUser.role === Role.Patient) {
      throw new ForbiddenException('Bemor analiz natijasini yangilay olmaydi!');
    }

    if (currentUser.role === Role.Specialist) {
      const specialist = await this.specialistModel.findOne({
        where: { user_id: currentUser.userId },
      });

      if (!specialist || booking.specialist_id !== specialist.id) {
        throw new ForbiddenException(
          'Siz faqat sizga biriktirilgan bronlarga tegishli analiz natijasini yangilashingiz mumkin!',
        );
      }
    }

    if (file_url) {
      if (result.file_url) {
        await this.fileService.removeFile(result.file_url);
      }
      result.file_url = await this.fileService.createFile(file_url);
    }

    await result.update(dto);
    return result;
  }

  async remove(id: number, currentUser: any): Promise<{ message: string }> {
    const result = await this.analysisModel.findByPk(id);

    if (!result) {
      throw new NotFoundException(
        `ID raqami ${id} bo‘lgan analiz natijasi topilmadi!`,
      );
    }

    if (result.file_url) {
      await this.fileService.removeFile(result.file_url);
    }

    await result.destroy();

    return {
      message: `ID raqami ${id} bo‘lgan analiz natijasi muvaffaqiyatli o‘chirildi!`,
    };
  }
}
