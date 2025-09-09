import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'statistics', timestamps: false })
export class Statistics extends Model<Statistics> {
  @Column({
    type: DataType.DATEONLY,
    primaryKey: true,
  })
  declare date: string;

  @Column(DataType.INTEGER)
  declare bookings_count: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare popular_service_id: number | null;

  @Column(DataType.INTEGER)
  declare user_count: number;
}
