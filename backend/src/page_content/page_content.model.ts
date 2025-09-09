import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'page_content', timestamps: true })
export class PageContent extends Model<PageContent> {
  @ApiProperty({
    description:
      'Unique identifier for the page content record (auto-generated)',
    example: 1,
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({
    description:
      'Unique technical name (slug) of the page. Used to identify the page in the system.',
    example: 'about-us',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare page_name: string;

  @ApiProperty({
    description:
      'Full content of the page. Can include HTML or plain text. For example, information about the clinic, doctors, or services.',
    example:
      '<h1>About Our Clinic</h1><p>Welcome to our clinic. We provide modern medical services, professional doctors, and high-quality patient care.</p>',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;
}
