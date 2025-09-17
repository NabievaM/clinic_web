import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SpecialistService } from './specialist_service.model';
import { CreateSpecialistServiceDto } from './dto/create-specialist_service.dto';

@Injectable()
export class SpecialistServiceService {
  constructor(
    @InjectModel(SpecialistService)
    private readonly specialistServiceModel: typeof SpecialistService,
  ) {}

  async create(dto: CreateSpecialistServiceDto) {
    const exists = await this.specialistServiceModel.findOne({
      where: { specialist_id: dto.specialist_id, service_id: dto.service_id },
    });
    if (exists) return exists;
    return this.specialistServiceModel.create(dto as any);
  }

  async findAllByService(serviceId: number) {
    return this.specialistServiceModel.findAll({
      where: { service_id: serviceId },
      include: [
        {
          association: 'specialist', // Specialist bilan bog'liq
          include: ['user'], // Specialist ichidagi User
        },
        'service', // Service ham qo‘shilsin
      ],
    });
  }

  async findAllBySpecialist(specialistId: number) {
    return this.specialistServiceModel.findAll({
      where: { specialist_id: specialistId },
      include: [
        {
          association: 'specialist',
          include: ['user'],
        },
        'service',
      ],
    });
  }

  async remove(id: number) {
    const row = await this.specialistServiceModel.findByPk(id);
    if (!row) throw new NotFoundException('Mapping not found');
    await row.destroy();
    return { deleted: true };
  }

  async removeByPair(specialistId: number, serviceId: number) {
    const row = await this.specialistServiceModel.findOne({
      where: { specialist_id: specialistId, service_id: serviceId },
    });
    if (!row) throw new NotFoundException('Mapping not found');
    await row.destroy();
    return { deleted: true };
  }
}
