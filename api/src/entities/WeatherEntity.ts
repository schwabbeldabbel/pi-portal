import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from "typeorm"

@Entity('weather_data')
@Unique('UQ_weather_source_measuredAt', ['source', 'measuredAt'])
export class WeatherEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('real')
  temperature_2m!: number;

  @Column('real')
  apparent_temperature!: number;

  @Column('real')
  precipitation!: number;

  @Column('real')
  cloud_cover!: number;

  @Column('real')
  wind_speed_10m!: number;

  @Column('int')
  weather_code!: number;

  @Column({ type: 'text' })
  source!: string;

  @Column({ type: 'datetime' })
  measuredAt!: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}