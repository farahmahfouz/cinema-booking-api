import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hall } from './entities/hall.entity';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';

@Injectable()
export class HallsService {
  constructor(
    @InjectRepository(Hall)
    private readonly hallRepo: Repository<Hall>,
  ) { }

  async create(createHallDto: CreateHallDto) {
    const hall = await this.hallRepo.findOne({
      where: { name: createHallDto.name }
    })
    if (hall) {
      throw new HttpException('Hall already exists', 400);
    }
    const newHall = this.hallRepo.create(createHallDto);
    const saved = await this.hallRepo.save(newHall);

    return {
      status: 'success',
      data: { hall: saved },
    };
  }

  async findAll() {
    const halls = await this.hallRepo.find({
      relations: ['seats', 'showtimes'],
    });

    return {
      status: 'success',
      data: halls,
    };
  }

  async findOne(id: number) {
    const hall = await this.hallRepo.findOne({
      where: { id },
      relations: ['seats', 'showtimes'],
    });

    if (!hall) {
      throw new NotFoundException(`Hall with id ${id} not found`);
    }

    return {
      status: 'success',
      data: hall,
    };
  }

  async update(id: number, updateHallDto: UpdateHallDto) {
    const hall = await this.hallRepo.findOneBy({ id });

    if (!hall) {
      throw new NotFoundException(`Hall with id ${id} not found`);
    }

    const updated = this.hallRepo.merge(hall, updateHallDto);
    const saved = await this.hallRepo.save(updated);

    return {
      status: 'success',
      data: { hall: saved },
    };
  }

  async remove(id: number) {
    throw new Error(
      'Deleting halls is disabled because it affects seats and showtimes relations',
    );
  }
}