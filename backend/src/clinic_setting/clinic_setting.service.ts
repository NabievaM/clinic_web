import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ValidationError } from 'sequelize';
import { ClinicSetting } from './clinic_setting.model';
import { CreateClinicSettingDto } from './dto/create-clinic_setting.dto';
import { FilesService } from '../file/file.service';

@Injectable()
export class ClinicSettingService {
  constructor(
    @InjectModel(ClinicSetting)
    private readonly clinicSettingModel: typeof ClinicSetting,
    private readonly fileService: FilesService,
  ) {}

  async create(
    dto: CreateClinicSettingDto,
    logo_url?: Express.Multer.File,
  ): Promise<ClinicSetting> {
    try {
      let fileName: string | null = null;

      if (logo_url) {
        fileName = await this.fileService.createFile(logo_url);
      }

      return await this.clinicSettingModel.create({
        ...dto,
        logo_url: fileName,
      } as any);
    } catch (error) {
      if (error instanceof ValidationError) {
        const messages = [
          ...new Set(
            error.errors.map((e) => {
              if (e.path === 'name') {
                return 'Klinika nomi bo‘sh bo‘lishi mumkin emas!';
              }
              if (e.path === 'phone') {
                return 'Telefon raqam kiritilishi shart!';
              }
              if (e.path === 'email') {
                return 'Email manzil noto‘g‘ri yoki bo‘sh!';
              }
              return `Maydon ${e.path} to‘ldirilishi majburiy!`;
            }),
          ),
        ];
        throw new BadRequestException(messages);
      }
      throw error;
    }
  }

  async findAll(): Promise<ClinicSetting[]> {
    return this.clinicSettingModel.findAll();
  }

  async findOne(id: number): Promise<ClinicSetting> {
    const clinic = await this.clinicSettingModel.findByPk(id);
    if (!clinic) {
      throw new NotFoundException(`ID raqami ${id} bo'lgan klinika topilmadi!`);
    }
    return clinic;
  }

  async updateById(
    id: number,
    dto: CreateClinicSettingDto,
  ): Promise<ClinicSetting> {
    const [count, updatedClinics] = await this.clinicSettingModel.update(dto, {
      where: { id },
      returning: true,
    });

    if (count === 0) {
      throw new NotFoundException(`ID raqami ${id} bo'lgan klinika topilmadi!`);
    }
    return updatedClinics[0];
  }

  async updateLogo(
    id: number,
    logo: Express.Multer.File,
  ): Promise<ClinicSetting> {
    const clinic = await this.findOne(id);

    if (clinic.logo_url) {
      await this.fileService.removeFile(clinic.logo_url);
    }

    const fileName = await this.fileService.createFile(logo);
    const [_, updatedClinics] = await this.clinicSettingModel.update(
      { logo_url: fileName },
      { where: { id }, returning: true },
    );

    return updatedClinics[0];
  }

  async removeLogo(id: number): Promise<boolean> {
    const clinic = await this.findOne(id);
    if (!clinic) {
      throw new NotFoundException(`ID raqami ${id} bo'lgan klinika topilmadi!`);
    }
    if (clinic.logo_url) {
      return this.fileService.removeFile(clinic.logo_url);
    }
    return false;
  }

  async remove(id: number): Promise<{ message: string }> {
    const clinic = await this.findOne(id);

    if (clinic.logo_url) {
      await this.fileService.removeFile(clinic.logo_url);
    }

    await clinic.destroy();
    return {
      message: `ID raqami ${id} bo'lgan klinika muvaffaqiyatli o‘chirildi!`,
    };
  }
}
