import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { ShowtimeStatusEnum } from '../entities/showtime.entity';

export class CreateShowtimeDto {
  @ApiProperty({
    example: '2026-06-20T18:00:00.000Z',
  })
  @IsDateString()
  start_time: Date;

  @ApiProperty({
    example: 150,
  })
  @IsInt()
  @Min(1)
  price: number;

  @ApiProperty({
    enum: ShowtimeStatusEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(ShowtimeStatusEnum)
  status?: ShowtimeStatusEnum;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  movie_id: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  hall_id: number;
}