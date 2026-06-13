import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class SigninUserDto {
    @ApiProperty({
        example: 'farah@gmail.com',
    })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email' })
    email: string;

    @ApiProperty({
        example: '12345678',
        minLength: 8,
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 100, { message: 'Password must be between 8 and 100 characters long' })
    password: string;
}