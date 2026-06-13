import { Seat } from "src/seats/entity/seats.entity";
import { Showtime } from "src/showtimes/entities/showtime.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('halls')
export class Hall {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  total_rows: number;

  @Column({ type: 'int' })
  seats_per_row: number;

  @OneToMany(() => Seat, (seat) => seat.hall)
  seats: Seat[];

  @OneToMany(() => Showtime, (showtime) => showtime.hall)
  showtimes: Showtime[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
