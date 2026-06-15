import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from 'src/common/services/upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { UsersModule } from 'src/users/users.module';
import { Genre } from 'src/genres/entities/genre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Genre]),
    MulterModule.register({ storage: memoryStorage() }),
    UsersModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService, UploadService],
})
export class MoviesModule {}
