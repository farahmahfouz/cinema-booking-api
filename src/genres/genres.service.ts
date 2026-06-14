import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepo: Repository<Genre>,
  ) { }

  async create(createGenreDto: CreateGenreDto) {
    const genre = await this.genreRepo.find({
      where: { name: createGenreDto.name }
    })

    if (genre) {
      throw new HttpException('Genre already exists', 400);
    }
    const newGenre = this.genreRepo.create(createGenreDto);
    const saved = await this.genreRepo.save(newGenre);

    return {
      status: 'success',
      data: { genre: saved },
    };
  }

  async findAll() {
    const genres = await this.genreRepo.find({
      relations: ['movies'],
    });

    return {
      status: 'success',
      data: genres,
    };
  }

  async findOne(id: number) {
    const genre = await this.genreRepo.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }

    return {
      status: 'success',
      data: genre,
    };
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.genreRepo.findOneBy({ id });

    if (!genre) {
      throw new NotFoundException(`Genre with id ${id} not found`);
    }

    const updated = this.genreRepo.merge(genre, updateGenreDto);
    const saved = await this.genreRepo.save(updated);

    return {
      status: 'success',
      data: { genre: saved },
    };
  }

  async remove(id: number) {
    throw new Error(
      'Deleting genres is not allowed because it may break movie relations',
    );
  }
}