import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../booking/booking.model';

interface ServiceCreationAttrs {
  name: string;
  price: number;
  duration: number;
  description?: string;
  is_popular?: boolean;
}

@Table({ tableName: 'services' })
export class Service extends Model<Service, ServiceCreationAttrs> {
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({
    example: 'Teeth Cleaning',
    description: 'Name of the service',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 50.0, description: 'Price of the service' })
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price: number;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  duration: number;

  @ApiProperty({
    example: 'Professional dental cleaning service',
    required: false,
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ApiProperty({
    example: true,
    description: 'Is this service popular?',
    required: false,
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_popular: boolean;

  @HasMany(() => Booking)
  bookings: Booking[];
}
