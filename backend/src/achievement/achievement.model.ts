import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'achievements', timestamps: true })
export class Achievement extends Model<Achievement> {
  @ApiProperty({
    description: 'Unique identifier for the achievement',
    example: 1,
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({
    description: 'Title of the achievement',
    example: 'Best Clinic Award 2024',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @ApiProperty({
    description: 'Detailed description of the achievement',
    example:
      'Our clinic was awarded the Best Clinic Award in 2024 for outstanding healthcare services.',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @ApiProperty({
    description: 'Date when the achievement was received',
    example: '2024-05-20',
  })
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare achieved_date: Date;

  @ApiProperty({
    description: 'Image URL of the achievement (certificate, trophy, etc.)',
    example: 'award2024.jpg',
    required: false,
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare image: string;
}
