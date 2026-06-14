import { Module } from '@nestjs/common';
import { HallsService } from './halls.service';
import { HallsController } from './halls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Hall } from './entities/hall.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hall]), UsersModule],
  controllers: [HallsController],
  providers: [HallsService],
})
export class HallsModule {}
