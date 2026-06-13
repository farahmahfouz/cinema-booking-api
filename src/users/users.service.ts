import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SigninUserDto } from './dto/signin-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>, private jwtService: JwtService) { }
  async signup(createUserDto: CreateUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: createUserDto.email }
    })

    if (user) {
      throw new HttpException('User already exists', 400);
    }

    const newUser = this.userRepo.create(createUserDto);
    await this.userRepo.save(newUser);

    const payload = { _id: newUser.id, role: newUser.role };

    const token = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });

    const { password, ...userWithoutPassword } = newUser;
    return {
      status: 'success',
      message: 'User created successfully',
      token,
      data: { user: userWithoutPassword },
    }
  }

  async signin(signinUserDto: SigninUserDto) {
    const user = await this.userRepo.findOne({
      where: { email: signinUserDto.email }
    })

    if (!user) {
      throw new HttpException('Invalid credentials', 401)
    }

    const isPasswordValid = await user.comparePassword(signinUserDto.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const payload = { _id: user.id, role: user.role };
    const token = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });

    const { password, ...userWithoutPassword } = user;

    return {
      status: 'success',
      token,
      data: { user: userWithoutPassword },
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
