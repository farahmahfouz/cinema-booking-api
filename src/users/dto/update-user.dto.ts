import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({
        example: 'Farah Mahfouz',
        minLength: 3,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @Length(3, 100, {
        message: 'Name must be between 3 and 100 characters long',
    })
    name: string;
}
