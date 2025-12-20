import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Achievement } from './achievement.model';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { FilesService } from '../file/file.service';
import { ValidationError } from 'sequelize';

@Injectable()
export class AchievementService {
  constructor(
    @InjectModel(Achievement)
    private readonly achievementModel: typeof Achievement,
    private readonly fileService: FilesService,
  ) {}

  async create(
    createAchievementDto: CreateAchievementDto,
    image?: Express.Multer.File,
  ): Promise<Achievement> {
    try {
      const fileName = await this.fileService.createFile(image);

      return await this.achievementModel.create({
        ...createAchievementDto,
        image: fileName,
      } as any);
    } catch (error) {
      if (error instanceof ValidationError) {
        const messages = error.errors.map((e) => {
          if (e.path === 'title') {
            return 'Sarlavha (title) maydoni bo‘sh bo‘lishi mumkin emas!';
          }
          if (e.path === 'description') {
            return 'Tavsif (description) maydoni bo‘sh bo‘lishi mumkin emas!';
          }
          if (e.path === 'achieved_date') {
            return 'Sana (achieved_date) to‘ldirilishi shart!';
          }
          return 'Barcha majburiy maydonlarni to‘ldirish kerak!';
        });

        throw new BadRequestException(messages.join(', '));
      }
      throw error;
    }
  }

  async findAll(): Promise<Achievement[]> {
    return this.achievementModel.findAll({
      order: [['achieved_date', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Achievement> {
    const achievement = await this.achievementModel.findByPk(id);
    if (!achievement) {
      throw new NotFoundException(`ID raqami ${id} bo‘lgan yutuq topilmadi!`);
    }
    return achievement;
  }

  async updateById(
    id: number,
    updateAchievementDto: UpdateAchievementDto,
  ): Promise<Achievement> {
    const [count, updated] = await this.achievementModel.update(
      updateAchievementDto,
      { where: { id }, returning: true },
    );

    if (count === 0) {
      throw new NotFoundException(`ID raqami ${id} bo‘lgan yutuq topilmadi!`);
    }

    return updated[0];
  }

  async updateImage(
    id: number,
    image: Express.Multer.File,
  ): Promise<Achievement> {
    const achievement = await this.findOne(id);

    if (achievement.image) {
      await this.fileService.removeFile(achievement.image);
    }

    const fileName = await this.fileService.createFile(image);
    const [_, updated] = await this.achievementModel.update(
      { image: fileName },
      { where: { id }, returning: true },
    );

    return updated[0];
  }

  async remove(id: number): Promise<{ message: string }> {
    const achievement = await this.findOne(id);

    if (achievement.image) {
      await this.fileService.removeFile(achievement.image);
    }

    await achievement.destroy();
    return {
      message: `ID raqami ${id} bo‘lgan yutuq muvaffaqiyatli o‘chirildi!`,
    };
  }
}
