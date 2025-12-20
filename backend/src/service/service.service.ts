import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './service.model';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ValidationError } from 'sequelize';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service) private readonly serviceRepository: typeof Service,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    try {
      return await this.serviceRepository.create(dto);
    } catch (error) {
      if (error instanceof ValidationError) {
        const messages = error.errors.map((e) => {
          if (e.path === 'name')
            return 'Name maydoni bo‘sh bo‘lishi mumkin emas!';
          if (e.path === 'price') return 'Price maydoni to‘ldirilishi shart!';
          if (e.path === 'duration')
            return 'Duration maydoni to‘ldirilishi shart!';
          return 'Maydonlarni to‘ldirish majburiy!';
        });
        throw new BadRequestException(messages.join(', '));
      }
      throw error;
    }
  }

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.findAll();
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findByPk(id);
    if (!service) {
      throw new NotFoundException(`ID raqami ${id} bo‘lgan service topilmadi!`);
    }
    return service;
  }

  async update(id: number, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);
    try {
      return await service.update(dto);
    } catch (error) {
      if (error instanceof ValidationError) {
        const messages = error.errors.map(
          (e) => `${e.path} maydoni noto‘g‘ri!`,
        );
        throw new BadRequestException(messages.join(', '));
      }
      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const service = await this.findOne(id);
    await service.destroy();
    return {
      message: `ID raqami ${id} bo‘lgan service muvaffaqiyatli o‘chirildi!`,
    };
  }
}
