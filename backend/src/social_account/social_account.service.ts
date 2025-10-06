import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SocialAccount } from './social_account.model';
import { CreateSocialAccountDto } from './dto/create-social_account.dto';
import { UpdateSocialAccountDto } from './dto/update-social_account.dto';
@Injectable()
export class SocialAccountService {
  constructor(
    @InjectModel(SocialAccount)
    private socialAccountRepository: typeof SocialAccount,
  ) {}
  async create(dto: CreateSocialAccountDto): Promise<SocialAccount> {
    if (!dto.url) {
      throw new BadRequestException('URL maydoni bo‘sh bo‘lishi mumkin emas.');
    }
    if (!dto.platform) {
      throw new BadRequestException('Platforma majburiy.');
    }
    try {
      const created = await this.socialAccountRepository.create(dto as any);
      return created;
    } catch (err) {
      throw new BadRequestException(
        err.message || 'Maʼlumot bazasida xatolik yuz berdi.',
      );
    }
  }
  async findAll(): Promise<SocialAccount[]> {
    const accounts = await this.socialAccountRepository.findAll();
    return accounts || [];
  }
  async findOne(id: number): Promise<SocialAccount> {
    const account = await this.socialAccountRepository.findByPk(id);
    if (!account) {
      throw new NotFoundException(
        `ID raqami ${id} bo‘lgan ijtimoiy tarmoq topilmadi.`,
      );
    }
    return account;
  }
  async update(
    id: number,
    dto: UpdateSocialAccountDto,
  ): Promise<SocialAccount> {
    const account = await this.findOne(id);
    if (dto.url !== undefined && !dto.url) {
      throw new BadRequestException('URL maydoni bo‘sh bo‘lishi mumkin emas.');
    }
    await account.update(dto);
    return account;
  }
  async remove(id: number): Promise<{ message: string }> {
    const account = await this.findOne(id);
    await account.destroy();
    return { message: `ID raqami ${id} bo‘lgan ijtimoiy tarmoq o‘chirildi.` };
  }
}
