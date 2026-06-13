import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SigninUserDto } from './dto/signin-user-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
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

  async findAll() {
    const users = await this.userRepo.find();
    if (users.length === 0) {
      throw new NotFoundException("Users doesn't exists")
    }
    return {
      status: 'success',
      count: users.length,
      data: { users }
    }
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException("User doesn't exists");
    }

    const { password, ...result } = user;

    return {
      status: 'success',
      data: { user: result }
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    const safeData = {
      name: updateUserDto.name,
    };

    this.userRepo.merge(user, safeData);

    const updatedUser = await this.userRepo.save(user);

    const { password, ...result } = updatedUser;

    return {
      status: 'success',
      data: { user: result },
    };
  }

  async promoteToAdmin(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('User is already admin');
    }

    user.role = UserRole.ADMIN;

    await this.userRepo.save(user);

    const { password, ...result } = user;

    return {
      status: 'success',
      data: { user: result },
    };
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    await this.userRepo.remove(user);
  
    return {
      status: 'success',
      message: 'User deleted successfully',
    };
  }
}
