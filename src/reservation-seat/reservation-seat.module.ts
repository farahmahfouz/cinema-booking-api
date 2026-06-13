import { Module } from '@nestjs/common';
import { ReservationSeatService } from './reservation-seat.service';
import { ReservationSeatController } from './reservation-seat.controller';

@Module({
  controllers: [ReservationSeatController],
  providers: [ReservationSeatService],
})
export class ReservationSeatModule {}
