import { Genre } from "src/genres/entities/genre.entity";
import { Showtime } from "src/showtimes/entities/showtime.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('movies')
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    title: string;

    @Column({ type: 'varchar', length: 100 })
    description: string;

    @Column({ type: 'varchar', length: 100 })
    image: string;

    @Column({ type: 'int' })
    duration: number;

    @ManyToOne(() => Genre, (genre) => genre.movies)
    @JoinColumn({ name: 'genre_id' })
    genre: Genre;

    @OneToMany(() => Showtime, (showtime) => showtime.movie)
    showtimes: Showtime[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
