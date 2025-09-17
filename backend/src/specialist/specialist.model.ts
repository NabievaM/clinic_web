import {
  Table,
  Column,
  DataType,
  Model,
  HasMany,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../booking/booking.model';
import { User } from '../user/user.model';
import { SpecialistService } from '../specialist_service/specialist_service.model';

@Table({ tableName: 'specialists' })
export class Specialist extends Model<Specialist> {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the specialist',
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({
    example: 5,
    description: 'Related user ID (role = specialist)',
  })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User)
  user: User;

  @ApiProperty({
    example: 'doctor.jpg',
    description: 'Photo of the specialist',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  declare photo: string | null;

  @ApiProperty({ example: 'Therapist', description: 'Job position' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare position: string;

  @ApiProperty({ example: '5 years', description: 'Years of experience' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare experience_years: string;

  @ApiProperty({ example: 'Cardiology', description: 'Specialization field' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare specialization: string;

  @ApiProperty({
    example: 'Mon-Fri 09:00-18:00',
    description: 'Working days and hours',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  declare working_days: string;

  @ApiProperty({
    example: 'active',
    description: 'Status of the specialist',
    enum: ['active', 'inactive'],
  })
  @Column({
    type: DataType.ENUM('active', 'inactive'),
    defaultValue: 'active',
  })
  declare status: string;

  @ApiProperty({
    example: 'Experienced cardiologist with 5 years of practice.',
    description: 'Specialist description',
  })
  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;

  @HasMany(() => Booking)
  bookings: Booking[];

  @HasMany(() => SpecialistService, 'specialist_id')
  specialistServices: SpecialistService[];
}
