import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity('pv_data')
export class PvReadingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('real')
  voltage!: number;

  @Column('real')
  current!: number;

  @Column('real')
  power!: number;

  @Column('real')
  shuntVoltageMv!: number;

  @Column({ type: 'text' })
  source!: string;

  @Column({ type: 'datetime' })
  measuredAt!: Date;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
