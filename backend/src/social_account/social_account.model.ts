import { ApiProperty } from '@nestjs/swagger';
import { Table, DataType, Column, Model } from 'sequelize-typescript';
import { Platform } from '../common/enums/platform.enum';

@Table({ tableName: 'social_accounts', timestamps: true })
export class SocialAccount extends Model<SocialAccount> {
  @ApiProperty({
    description: 'Unique identifier for the social account record',
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
      'The social media platform of the clinic (e.g., Facebook, Instagram, Telegram)',
    enum: Platform,
    example: Platform.Facebook,
  })
  @Column({
    type: DataType.ENUM(...Object.values(Platform)),
    allowNull: false,
    defaultValue: Platform.Facebook,
  })
  declare platform: Platform;

  @ApiProperty({
    description: 'The URL link to the clinic’s social media account',
    example: 'https://www.facebook.com/clinicname',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare url: string;
}
