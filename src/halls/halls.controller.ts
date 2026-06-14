import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HallsService } from './halls.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('halls')
export class HallsController {
  constructor(private readonly hallsService: HallsService) {}

  @Get()
  findAll() {
    return this.hallsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hallsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createHallDto: CreateHallDto) {
    return this.hallsService.create(createHallDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHallDto: UpdateHallDto) {
    return this.hallsService.update(+id, updateHallDto);
  }

  @Delete(':id')
  remove() {
    return {
      message: 'Deleting halls is disabled to protect seats and showtimes',
    };
  }
}