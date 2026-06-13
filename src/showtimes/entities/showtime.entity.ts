import { Hall } from "src/halls/entities/hall.entity";
import { Movie } from "src/movies/entities/movie.entity";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ShowtimeStatusEnum {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('showtimes')
export class Showtime {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp' })
    start_time: Date;

    @Column({ type: 'timestamp' })
    end_time: Date;

    @Column({ type: 'int' })
    price: number;

    @Column({
        type: 'enum',
        enum: ShowtimeStatusEnum,
        default: ShowtimeStatusEnum.ACTIVE
    })
    status: ShowtimeStatusEnum;

    @ManyToOne(() => Movie, (movie) => movie.showtimes)
    @JoinColumn({ name: 'movie_id' })
    movie: Movie;

    @ManyToOne(() => Hall, (hall) => hall.showtimes)
    @JoinColumn({ name: 'hall_id' })
    hall: Hall;

    @OneToMany(() => Reservation, (reservation) => reservation.showtime)
    reservations: Reservation[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
