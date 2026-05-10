import { Module } from '@nestjs/common';
import { ApiflightController } from './apiflight.controller';
import { ApiflightService } from './apiflight.service';
import { AirportModule } from '../airport/airport.module';
import { FlightModule } from '../flight/flight.module';

@Module({
  imports: [AirportModule, FlightModule],
  controllers: [ApiflightController],
  providers: [ApiflightService],
})
export class ApiflightModule {}
