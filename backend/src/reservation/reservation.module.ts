import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FlightModule } from '../flight/flight.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, FlightModule, AuthModule],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
