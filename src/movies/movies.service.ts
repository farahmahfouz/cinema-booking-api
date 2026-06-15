import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { Genre } from 'src/genres/entities/genre.entity';

@Injectable()
export class MoviesService {
  constructor(@InjectRepository(Movie) private movieRepo: Repository<Movie>, @InjectRepository(Genre)
  private genreRepo: Repository<Genre>,) { }

  async create(createMovieDto: CreateMovieDto) {
    const existingMovie = await this.movieRepo.findOne({
      where: { title: createMovieDto.title },
    });

    if (existingMovie) {
      throw new HttpException(
        'Movie already exists',
        400,
      );
    }

    const genre = await this.genreRepo.findOneBy({
      id: createMovieDto.genre,
    });

    if (!genre) {
      throw new NotFoundException(
        'Genre not found',
      );
    }

    const movie = this.movieRepo.create({
      title: createMovieDto.title,
      description: createMovieDto.description,
      image: createMovieDto.image,
      duration: createMovieDto.duration,
      genre,
    });

    await this.movieRepo.save(movie);

    return {
      status: 'success',
      data: { movie },
    };
  }

  async findAll() {
    const movies = await this.movieRepo.find({
      relations: ['genre', 'showtimes'],
    });
    if (movies.length === 0) {
      throw new NotFoundException("Movies doesn't exists");
    }

    return {
      status: "success",
      count: movies.length,
      data: { movies }
    }
  }

  async findOne(id: number) {
    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: ['genre', 'showtimes'],
    });
    
     if (!movie) {
      throw new NotFoundException("Movie doesn't exists");
    }
    return {
      status: "success",
      data: { movie }
    }
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieRepo.findOneBy({ id });
    if (!movie) {
      throw new NotFoundException("Movie doesn't exists");
    }

    const { genre: genreId, ...rest } = updateMovieDto;

    if (genreId !== undefined) {
      const genre = await this.genreRepo.findOneBy({ id: genreId });

      if (!genre) {
        throw new NotFoundException('Genre not found');
      }

      movie.genre = genre;
    }

    this.movieRepo.merge(movie, rest);

    await this.movieRepo.save(movie);
    return {
      status: "success",
      data: { movie }
    }
  }

  async remove(id: number) {
    const movie = await this.movieRepo.findOneBy({ id });
    if (!movie) {
      throw new NotFoundException("Movie doesn't exists");
    }
    await this.movieRepo.remove(movie);

    return {
      status: 'success',
      message: 'Movie deleted successfully',
    };
  }
}
