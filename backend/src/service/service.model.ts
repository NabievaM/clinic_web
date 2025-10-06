import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../booking/booking.model';
import { SpecialistService } from '../specialist_service/specialist_service.model';

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
  declare name: string;

  @ApiProperty({ example: 50.0, description: 'Price of the service' })
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  declare price: number;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare duration: number;

  @ApiProperty({
    example: 'Professional dental cleaning service',
    required: false,
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @ApiProperty({
    example: true,
    description: 'Is this service popular?',
    required: false,
  })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare is_popular: boolean;

  @HasMany(() => Booking)
  declare bookings: Booking[];

  @HasMany(() => SpecialistService, 'service_id')
  declare specialistServices: SpecialistService[];
}
