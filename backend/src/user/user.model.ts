import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
  AfterCreate,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../common/enums/role.enum';
import { Booking } from '../booking/booking.model';
import { Specialist } from '../specialist/specialist.model';
import { Statistics } from '../statistics/statistic.model';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @ApiProperty({ description: 'Unique identifier for the user', example: 1 })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare full_name: string;

  @ApiProperty({ description: 'Phone number', example: '+998901234567' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare phone: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @ApiProperty({
    description: 'Home address of the user',
    example: '123 Main St, Tashkent, Uzbekistan',
  })
  @Column({ type: DataType.STRING, allowNull: true })
  declare address: string | null;

  @ApiProperty({ description: 'Role of the user', enum: Role })
  @Column({
    type: DataType.ENUM(...Object.values(Role)),
    allowNull: false,
    defaultValue: Role.Patient,
  })
  declare role: Role;

  @ApiProperty({ description: 'Hashed password' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare password_hash: string;

  @ApiProperty({ description: "User's hashed refresh token" })
  @Column({ type: DataType.STRING, allowNull: true })
  declare hashed_refresh_token: string | null;

  @HasMany(() => Booking)
  bookings: Booking[];

  @HasOne(() => Specialist)
  specialist: Specialist;

  @AfterCreate
  static async updateStatistics(instance: User) {
    const today = new Date().toISOString().split('T')[0];
    const stat = await Statistics.findByPk(today);

    if (stat) {
      await stat.increment('user_count');
    } else {
      await Statistics.create({
        date: today,
        user_count: 1,
        bookings_count: 0,
        popular_service_id: null,
      } as any);
    }
  }
}
