import { ApiProperty } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
  AfterCreate,
} from 'sequelize-typescript';
import { User } from '../user/user.model';
import { Service } from '../service/service.model';
import { Specialist } from '../specialist/specialist.model';
import { BookingStatus } from '../common/enums/status.enum';
import { AnalysisResult } from '../analysis_result/analysis_result.model';
import { Statistics } from '../statistics/statistic.model';
import { Sequelize } from 'sequelize';

@Table({ tableName: 'bookings', timestamps: true })
export class Booking extends Model<Booking> {
  @ApiProperty({ description: 'Unique identifier', example: 1 })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({
    description: 'ID of the user who made the booking',
    example: 10,
  })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @ApiProperty({ description: 'ID of the service being booked', example: 3 })
  @ForeignKey(() => Service)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare service_id: number;

  @ApiProperty({ description: 'ID of the specialist assigned', example: 5 })
  @ForeignKey(() => Specialist)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare specialist_id: number;

  @ApiProperty({
    description: 'Booking date and time',
    example: '2025-09-10T14:30:00Z',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  declare booking_datetime: Date;

  @ApiProperty({
    description: 'Current booking status',
    example: 'pending',
    enum: BookingStatus,
  })
  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    allowNull: false,
    defaultValue: BookingStatus.PENDING,
  })
  declare status: BookingStatus;

  @HasMany(() => AnalysisResult)
  analysisResults: AnalysisResult[];

  @AfterCreate
  static async updateStatistics(instance: Booking) {
    const today = new Date().toISOString().split('T')[0];
    let stat = await Statistics.findByPk(today);

    if (!stat) {
      stat = await Statistics.create({
        date: today,
        bookings_count: 0,
        user_count: await User.count(),
        popular_service_id: null,
      } as any);
    }

    await stat.increment('bookings_count');

    const [result] = await Booking.findAll({
      attributes: [
        'service_id',
        [Sequelize.fn('COUNT', Sequelize.col('service_id')), 'count'],
      ],
      group: ['service_id'],
      order: [[Sequelize.literal('count'), 'DESC']],
      limit: 1,
      raw: true,
    });

    if (result) {
      await stat.update({ popular_service_id: result.service_id });

      await Service.update({ is_popular: false }, { where: {} });
      await Service.update(
        { is_popular: true },
        { where: { id: result.service_id } },
      );
    }
  }
}
