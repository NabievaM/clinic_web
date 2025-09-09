import { Injectable } from '@nestjs/common';
import { Statistics } from './statistic.model';

@Injectable()
export class StatisticsService {
  async getAll() {
    return Statistics.findAll({ order: [['date', 'DESC']] });
  }

  async getByDate(date: string) {
    return Statistics.findByPk(date);
  }
}
