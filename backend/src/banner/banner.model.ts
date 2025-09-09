import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface BannerAttributes {
  id?: number;
  image: string;
  title: string;
  subtitle?: string;
  display_order: number;
}

@Table({ tableName: 'banners' })
export class Banner
  extends Model<BannerAttributes>
  implements BannerAttributes
{
  @ApiProperty({
    description: 'Unique identifier of the banner',
    example: 1,
  })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({
    description: 'Banner image file (uploaded)',
    type: 'string',
    format: 'binary',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare image: string;

  @ApiProperty({
    description: 'Main title of the banner',
    example: 'Welcome to our platform',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @ApiPropertyOptional({
    description: 'Subtitle text of the banner',
    example: 'Discover the best deals here',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare subtitle: string;

  @ApiProperty({
    description: 'Order in which the banner should be displayed',
    example: 1,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare display_order: number;
}
