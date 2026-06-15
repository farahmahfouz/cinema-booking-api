import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
export class CreateMovieDto {
  @ApiProperty({
    example: 'Inception',
    description: 'Movie title',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  title: string;

  @ApiProperty({
    example: 'A thief who steals corporate secrets through dream-sharing technology.',
    description: 'Movie description',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 1000)
  description: string;

  @ApiProperty({
    example: 148,
    description: 'Movie duration in minutes',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    example: 'https://example.com/inception.jpg',
    description: 'Movie poster image URL',
  })
  @IsOptional()
  image?: string;

  @ApiProperty({
    example: 1,
    description: 'Genre ID',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  genre: number;
}