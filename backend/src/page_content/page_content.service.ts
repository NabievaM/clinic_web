import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PageContent } from './page_content.model';
import { CreatePageContentDto } from './dto/create-page_content.dto';
import { UpdatePageContentDto } from './dto/update-page_content.dto';

@Injectable()
export class PageContentService {
  constructor(
    @InjectModel(PageContent)
    private pageContentRepository: typeof PageContent,
  ) {}

  async create(dto: CreatePageContentDto): Promise<PageContent> {
    if (!dto.page_name || !dto.content) {
      throw new BadRequestException(
        'Sahifa nomi va kontent bo‘sh bo‘lishi mumkin emas.',
      );
    }
    return this.pageContentRepository.create(dto as any);
  }

  async findAll(): Promise<PageContent[]> {
    const pages = await this.pageContentRepository.findAll();
    if (!pages.length) {
      throw new NotFoundException('Hech qanday sahifa kontenti topilmadi.');
    }
    return pages;
  }

  async findOne(id: number): Promise<PageContent> {
    const page = await this.pageContentRepository.findByPk(id);
    if (!page) {
      throw new NotFoundException(
        `ID raqami ${id} bo‘lgan sahifa kontenti topilmadi.`,
      );
    }
    return page;
  }

  async update(id: number, dto: UpdatePageContentDto): Promise<PageContent> {
    const page = await this.findOne(id);

    if (dto.page_name !== undefined && !dto.page_name) {
      throw new BadRequestException('Sahifa nomi bo‘sh bo‘lishi mumkin emas.');
    }
    if (dto.content !== undefined && !dto.content) {
      throw new BadRequestException(
        'Sahifa kontenti bo‘sh bo‘lishi mumkin emas.',
      );
    }

    await page.update(dto);
    return page;
  }

  async remove(id: number): Promise<{ message: string }> {
    const page = await this.findOne(id);
    await page.destroy();
    return { message: `ID raqami ${id} bo‘lgan sahifa kontenti o‘chirildi.` };
  }
}
