import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'clinic_settings' })
export class ClinicSetting extends Model<ClinicSetting> {
  @ApiProperty({ example: 1, description: 'Unique ID of the clinic setting' })
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 'Topraqam Clinic', description: 'Clinic name' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @ApiProperty({ example: 'logo.jpg', description: 'Clinic logo file name' })
  @Column({ type: DataType.STRING, allowNull: true })
  declare logo_url?: string | null;

  @ApiProperty({ example: '123 Main St', description: 'Clinic address' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare address: string;

  @ApiProperty({ example: '+998901234567', description: 'Clinic phone number' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare phone: string;

  @ApiProperty({ example: 'clinic@example.com', description: 'Clinic email' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare email: string;

  @ApiProperty({
    example: '{"mon":"9-18","tue":"9-18"}',
    description: 'Working hours in JSON format',
  })
  @Column({ type: DataType.JSON, allowNull: false })
  declare working_hours: object;

  @ApiProperty({
    example: '41.311081,69.240562',
    description: 'Map location (latitude, longitude)',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  declare map_location: string;
}
