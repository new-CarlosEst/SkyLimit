import { Module } from '@nestjs/common';
import { AirportModule } from '../airport/airport.module';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
    imports: [AirportModule, PrismaModule],
    controllers: [FlightController],
    providers: [FlightService],
    exports: [FlightService],
})
export class FlightModule { }
