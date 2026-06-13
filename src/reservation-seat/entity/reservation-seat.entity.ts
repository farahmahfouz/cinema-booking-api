import { Reservation } from "src/reservations/entities/reservation.entity";
import { Seat } from "src/seats/entity/seats.entity";
import { Showtime } from "src/showtimes/entities/showtime.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('reservation_seats')
@Unique(['seat', 'showtime']) 
export class ReservationSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reservation, (reservation) => reservation.reservationSeats)
  @JoinColumn({ name: 'reservation_id' })
  reservation: Reservation;

  @ManyToOne(() => Seat)
  @JoinColumn({ name: 'seat_id' })
  seat: Seat;

  @ManyToOne(() => Showtime)
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;
}