import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Banner } from './banner.model';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FilesService } from '../file/file.service';
import { ValidationError } from 'sequelize';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner)
    private readonly bannerModel: typeof Banner,
    private readonly fileService: FilesService,
  ) {}

  async create(
    createBannerDto: CreateBannerDto,
    image: Express.Multer.File,
  ): Promise<Banner> {
    try {
      const fileName = await this.fileService.createFile(image);

      return await this.bannerModel.create({
        ...createBannerDto,
        image: fileName,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        const messages = error.errors.map((e) => {
          if (e.path === 'display_order') {
            return 'Display order maydoni to‘ldirilishi shart!';
          }
          if (e.path === 'title') {
            return 'Sarlavha (title) maydoni bo‘sh bo‘lishi mumkin emas!';
          }
          return 'Maydonlarni to‘ldirish majburiy!';
        });

        throw new BadRequestException(messages.join(', '));
      }
      throw error;
    }
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerModel.findAll({
      order: [['display_order', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Banner> {
    const banner = await this.bannerModel.findByPk(id);
    if (!banner) {
      throw new NotFoundException(`ID raqami ${id} bo'lgan banner topilmadi!`);
    }
    return banner;
  }

  async updateById(
    id: number,
    updateBannerDto: UpdateBannerDto,
  ): Promise<Banner> {
    const [count, updatedBanners] = await this.bannerModel.update(
      updateBannerDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (count === 0) {
      throw new NotFoundException(`ID raqami ${id} bo'lgan banner topilmadi!`);
    }
    return updatedBanners[0];
  }

  async removeFile(id: number): Promise<boolean> {
    const banner = await this.bannerModel.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`ID raqami ${id} bo'lgan banner topilmadi!`);
    }
    return this.fileService.removeFile(banner.image);
  }

  async updateImage(id: number, image: Express.Multer.File): Promise<Banner> {
    const banner = await this.findOne(id);

    if (banner.image) {
      await this.fileService.removeFile(banner.image);
    }

    const fileName = await this.fileService.createFile(image);
    const [_, updatedBanners] = await this.bannerModel.update(
      { image: fileName },
      { where: { id }, returning: true },
    );

    return updatedBanners[0];
  }

  async remove(id: number): Promise<{ message: string }> {
    const banner = await this.findOne(id);

    if (banner.image) {
      await this.fileService.removeFile(banner.image);
    }

    await banner.destroy();
    return {
      message: `ID raqami ${id} bo'lgan banner muvaffaqiyatli o‘chirildi!`,
    };
  }
}
