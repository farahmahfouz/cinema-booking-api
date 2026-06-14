import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(@InjectRepository(Movie) private movieRepo: Repository<Movie>) { }

  async create(createMovieDto: CreateMovieDto) {
    const movie = await this.movieRepo.findOne({
      where: { title: createMovieDto.title }
    });

    if (movie) {
      throw new HttpException('Movie already exists', 400);
    }
    const newMovie = this.movieRepo.create(createMovieDto);
    await this.movieRepo.save(newMovie);

    return {
      status: 'success',
      data: { movie: newMovie }
    }
  }

  async findAll() {
    const movies = await this.movieRepo.find();
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
    const movie = await this.movieRepo.findOneBy({ id });
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

    this.movieRepo.merge(movie, updateMovieDto);

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
