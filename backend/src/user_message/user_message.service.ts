import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserMessage } from './user_message.model';
import { CreateUserMessageDto } from './dto/create-user_message.dto';
import { ValidationError } from 'sequelize';

@Injectable()
export class UserMessageService {
  constructor(
    @InjectModel(UserMessage)
    private readonly userMessageModel: typeof UserMessage,
  ) {}

  async create(dto: CreateUserMessageDto): Promise<UserMessage> {
    try {
      return await this.userMessageModel.create(dto as any);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException('Barcha maydonlarni to‘ldirish shart!');
      }
      throw error;
    }
  }

  async findAll(): Promise<UserMessage[]> {
    return this.userMessageModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<UserMessage> {
    const message = await this.userMessageModel.findByPk(id);
    if (!message) {
      throw new NotFoundException(`ID ${id} bo‘yicha xabar topilmadi!`);
    }
    return message;
  }

  async remove(id: number): Promise<{ message: string }> {
    const message = await this.findOne(id);
    await message.destroy();

    return {
      message: `ID ${id} bo‘lgan xabar o‘chirildi`,
    };
  }
}
