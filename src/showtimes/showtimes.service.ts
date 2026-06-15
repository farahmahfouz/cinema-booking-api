import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Showtime } from './entities/showtime.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Hall } from '../halls/entities/hall.entity';

import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { ShowtimeStatusEnum } from './entities/showtime.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepo: Repository<Showtime>,

    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,

    @InjectRepository(Hall)
    private readonly hallRepo: Repository<Hall>,
  ) { }

  async create(
    createShowtimeDto: CreateShowtimeDto,
  ) {
    const movie = await this.movieRepo.findOneBy({
      id: createShowtimeDto.movie_id,
    });

    if (!movie) {
      throw new NotFoundException(
        'Movie not found',
      );
    }

    const hall = await this.hallRepo.findOneBy({
      id: createShowtimeDto.hall_id,
    });

    if (!hall) {
      throw new NotFoundException(
        'Hall not found',
      );
    }

    if (
      new Date(createShowtimeDto.start_time) >=
      new Date(createShowtimeDto.end_time)
    ) {
      throw new BadRequestException(
        'Start time must be before end time',
      );
    }

    const showtime = this.showtimeRepo.create({
      start_time: createShowtimeDto.start_time,
      end_time: createShowtimeDto.end_time,
      price: createShowtimeDto.price,
      status:
        createShowtimeDto.status ??
        ShowtimeStatusEnum.ACTIVE,
      movie,
      hall,
    });

    const saved =
      await this.showtimeRepo.save(showtime);

    return {
      status: 'success',
      data: {
        showtime: saved,
      },
    };
  }

  async findAll() {
    const showtimes =
      await this.showtimeRepo.find({
        relations: [
          'movie',
          'hall',
          'reservations',
        ],
      });

    return {
      status: 'success',
      data: {
        showtimes,
      },
    };
  }

  async findOne(id: number) {
    const showtime =
      await this.showtimeRepo.findOne({
        where: { id },
        relations: [
          'movie',
          'hall',
          'reservations',
        ],
      });

    if (!showtime) {
      throw new NotFoundException(
        'Showtime not found',
      );
    }

    return {
      status: 'success',
      data: {
        showtime,
      },
    };
  }

  async update(
    id: number,
    updateShowtimeDto: UpdateShowtimeDto,
  ) {
    const showtime =
      await this.showtimeRepo.findOne({
        where: { id },
        relations: ['movie', 'hall'],
      });

    if (!showtime) {
      throw new NotFoundException(
        'Showtime not found',
      );
    }

    if (updateShowtimeDto.movie_id) {
      const movie =
        await this.movieRepo.findOneBy({
          id: updateShowtimeDto.movie_id,
        });

      if (!movie) {
        throw new NotFoundException(
          'Movie not found',
        );
      }

      showtime.movie = movie;
    }

    if (updateShowtimeDto.hall_id) {
      const hall =
        await this.hallRepo.findOneBy({
          id: updateShowtimeDto.hall_id,
        });

      if (!hall) {
        throw new NotFoundException(
          'Hall not found',
        );
      }

      showtime.hall = hall;
    }

    this.showtimeRepo.merge(
      showtime,
      updateShowtimeDto,
    );

    const updated =
      await this.showtimeRepo.save(showtime);

    return {
      status: 'success',
      data: {
        showtime: updated,
      },
    };
  }

  // Soft Delete
  async remove(id: number) {
    const showtime =
      await this.showtimeRepo.findOneBy({
        id,
      });

    if (!showtime) {
      throw new NotFoundException(
        'Showtime not found',
      );
    }

    showtime.status =
      ShowtimeStatusEnum.INACTIVE;

    await this.showtimeRepo.save(showtime);

    return {
      status: 'success',
      message:
        'Showtime deactivated successfully',
    };
  }
}