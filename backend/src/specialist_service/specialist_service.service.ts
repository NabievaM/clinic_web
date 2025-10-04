import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SpecialistService } from './specialist_service.model';
import { CreateSpecialistServiceDto } from './dto/create-specialist_service.dto';
import { Specialist } from '../specialist/specialist.model';
import { Service } from '../service/service.model';

@Injectable()
export class SpecialistServiceService {
  constructor(
    @InjectModel(SpecialistService)
    private readonly specialistServiceModel: typeof SpecialistService,
    @InjectModel(Specialist)
    private readonly specialistModel: typeof Specialist,
    @InjectModel(Service)
    private readonly serviceModel: typeof Service,
  ) {}

  async create(dto: CreateSpecialistServiceDto) {
    const specialist = await this.specialistModel.findByPk(dto.specialist_id);
    if (!specialist) {
      throw new BadRequestException(
        `Mutaxassis ID ${dto.specialist_id} mavjud emas`,
      );
    }

    const service = await this.serviceModel.findByPk(dto.service_id);
    if (!service) {
      throw new BadRequestException(`Xizmat ID ${dto.service_id} mavjud emas`);
    }

    const exists = await this.specialistServiceModel.findOne({
      where: { specialist_id: dto.specialist_id, service_id: dto.service_id },
    });
    if (exists) {
      throw new BadRequestException(
        `Bu mutaxassisga bu xizmat allaqachon biriktirilgan`,
      );
    }

    const created = await this.specialistServiceModel.create(dto as any);

    return this.specialistServiceModel.findByPk(created.id, {
      include: [
        {
          association: 'specialist',
          include: ['user'],
        },
        'service',
      ],
    });
  }

  async findAll() {
    return this.specialistServiceModel.findAll({
      include: [
        {
          association: 'specialist',
          include: ['user'],
        },
        'service',
      ],
    });
  }

  async findAllByService(serviceId: number) {
    return this.specialistServiceModel.findAll({
      where: { service_id: serviceId },
      include: [
        {
          association: 'specialist',
          include: ['user'],
        },
        'service',
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

  async findOne(id: number) {
    const row = await this.specialistServiceModel.findByPk(id, {
      include: [
        {
          association: 'specialist',
          include: ['user'],
        },
        'service',
      ],
    });
    if (!row) throw new NotFoundException('Mapping not found');
    return row;
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
