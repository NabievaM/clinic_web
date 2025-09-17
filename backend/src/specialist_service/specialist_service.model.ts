import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Specialist } from '../specialist/specialist.model';
import { Service } from '../service/service.model';

@Table({
  tableName: 'specialist_services',
  timestamps: false,
})
export class SpecialistService extends Model<SpecialistService> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Specialist)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  specialist_id: number;

  @ForeignKey(() => Service)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  service_id: number;

  @BelongsTo(() => Specialist, 'specialist_id')
  specialist: Specialist;

  @BelongsTo(() => Service, 'service_id')
  service: Service;
}
