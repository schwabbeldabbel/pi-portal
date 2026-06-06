import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity('weather_data')
export class WeatherEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('real')
    temperature!: number;

    @Column('real')
    humidity!: number;

    @Column({ type: 'text' })
    source!: string;

    @Column({ type: 'datetime' })
    measuredAt!: Date;
}
