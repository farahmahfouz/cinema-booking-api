import { Controller } from '@nestjs/common';
import { ReservationSeatService } from './reservation-seat.service';

@Controller('reservation-seat')
export class ReservationSeatController {
  constructor(private readonly reservationSeatService: ReservationSeatService) {}
}
