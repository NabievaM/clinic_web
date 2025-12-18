import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'contact_messages', timestamps: true })
export class UserMessage extends Model<UserMessage> {
  @ApiProperty({ example: 1 })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 'Ali Valiyev' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @ApiProperty({ example: '+998901234567' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone: string;

  @ApiProperty({ example: 'I had a question...' })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare message: string;
}
