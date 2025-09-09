import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Booking } from '../booking/booking.model';

@Table({ tableName: 'analysis_results' })
export class AnalysisResult extends Model<AnalysisResult> {
  @ApiProperty({ example: 1, description: 'Unique ID of the analysis result' })
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 5, description: 'Related booking ID' })
  @ForeignKey(() => Booking)
  @Column({ type: DataType.BIGINT, allowNull: false })
  declare booking_id: number;

  @BelongsTo(() => Booking)
  booking: Booking;

  @ApiProperty({
    example: 'analysis-result.pdf',
    description: 'URL of the uploaded PDF file',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  declare file_url: string;

  @ApiProperty({
    example: 'Blood test results: everything is normal',
    description: 'Optional description about the analysis result',
    required: false,
  })
  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string | null;
}
