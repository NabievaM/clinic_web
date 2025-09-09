import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Specialist } from './specialist.model';
import { CreateSpecialistDto } from './dto/create-specialist.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { FilesService } from '../file/file.service';
import { ValidationError } from 'sequelize';
import { User } from '../user/user.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SpecialistService {
  constructor(
    @InjectModel(Specialist)
    private readonly specialistRepository: typeof Specialist,
    private readonly fileService: FilesService,
  ) {}

  async create(
    createSpecialistDto: CreateSpecialistDto,
    photo: Express.Multer.File,
  ): Promise<Specialist> {
    try {
      if (!photo) {
        throw new BadRequestException('Mutaxassis rasmi yuklanishi shart!');
      }

      const fileName = await this.fileService.createFile(photo);

      return await this.specialistRepository.create({
        ...createSpecialistDto,
        photo: fileName,
      } as any);
    } catch (error) {
      if (error instanceof ValidationError) {
        const messages = error.errors.map((e) => {
          if (e.path === 'full_name') return 'Mutaxassis to‘liq ismi majburiy!';
          if (e.path === 'position') return 'Lavozim majburiy maydon!';
          if (e.path === 'experience_years')
            return 'Tajriba yillari ko‘rsatilishi shart!';
          if (e.path === 'specialization')
            return 'Mutaxassislik bo‘sh bo‘lishi mumkin emas!';
          if (e.path === 'working_days')
            return 'Ish kunlari ko‘rsatilishi shart!';
        });
        throw new BadRequestException(messages.join(', '));
      }
      throw error;
    }
  }

  async findAll(): Promise<Specialist[]> {
    const specialists = await this.specialistRepository.findAll({
      include: [{ model: User }],
    });

    if (!specialists || specialists.length === 0) {
      throw new NotFoundException('Hech qanday mutaxassis topilmadi!');
    }
    return specialists;
  }

  async findOne(id: number): Promise<Specialist> {
    const specialist = await this.specialistRepository.findByPk(id, {
      include: [{ model: User }],
    });
    if (!specialist) {
      throw new NotFoundException(
        `ID raqami ${id} bo‘lgan mutaxassis topilmadi!`,
      );
    }
    return specialist;
  }

  async update(
    id: number,
    updateSpecialistDto: UpdateSpecialistDto,
  ): Promise<Specialist> {
    const specialist = await this.findOne(id);
    try {
      return await specialist.update(updateSpecialistDto);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException(
          error.errors.map((e) => e.message).join(', '),
        );
      }
      throw error;
    }
  }

  async updatePhoto(
    id: number,
    photo: Express.Multer.File,
  ): Promise<Specialist> {
    const specialist = await this.findOne(id);

    if (!photo) {
      throw new BadRequestException('Yangi rasm yuklash majburiy!');
    }

    if (specialist.photo) {
      await this.fileService.removeFile(specialist.photo);
    }

    const fileName = await this.fileService.createFile(photo);
    const [_, updatedSpecialists] = await this.specialistRepository.update(
      { photo: fileName },
      { where: { id }, returning: true },
    );

    return updatedSpecialists[0];
  }

  async removePhoto(id: number): Promise<Specialist> {
    const specialist = await this.findOne(id);

    const photo = specialist.photo;

    if (!photo) {
      throw new NotFoundException(
        `ID raqami ${id} bo‘lgan mutaxassisda rasm topilmadi.`,
      );
    }

    const filePath = path.resolve(__dirname, '..', '..', 'uploads', photo);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    specialist.photo = null;
    await specialist.save();

    return specialist;
  }

  async remove(id: number): Promise<{ message: string }> {
    const specialist = await this.findOne(id);

    if (specialist.photo) {
      await this.fileService.removeFile(specialist.photo);
    }

    await specialist.destroy();
    return {
      message: `ID raqami ${id} bo‘lgan mutaxassis muvaffaqiyatli o‘chirildi!`,
    };
  }
}
