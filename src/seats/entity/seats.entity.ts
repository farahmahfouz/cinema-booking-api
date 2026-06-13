import { Hall } from "src/halls/entities/hall.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('seats')
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  label: string; // A1, B5, etc.

  @Column({ type: 'int' })
  row_number: number;

  @Column({ type: 'int' })
  seat_number: number;

  @ManyToOne(() => Hall, (hall) => hall.seats)
  @JoinColumn({ name: 'hall_id' })
  hall: Hall;
}