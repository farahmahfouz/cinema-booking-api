import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateHallDto {
    @ApiProperty({ example: 'Hall A' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 10 })
    @IsInt()
    @Min(1)
    total_rows: number;

    @ApiProperty({ example: 15 })
    @IsInt()
    @Min(1)
    seats_per_row: number;
}