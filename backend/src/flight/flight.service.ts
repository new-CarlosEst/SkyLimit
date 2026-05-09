import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { AirportService } from '../airport/airport.service';


@Injectable()
export class FlightService {
  constructor(private readonly prisma: PrismaService, private readonly airportService: AirportService) { }

  /**
   * 
   */
  public async createFlight(createFlightDto: CreateFlightDto) {
    const { airportDepartureId, airportArrivalId } = createFlightDto;
    const [departure, arrival] = await Promise.all([
      this.airportService.getAirportById(airportDepartureId),
      this.airportService.getAirportById(airportArrivalId),
    ]);
    if (!departure) throw new NotFoundException('Aeropuerto de salida no encontrado');
    if (!arrival) throw new NotFoundException('Aeropuerto de llegada no encontrado');

    return this.prisma.flight.create({
      data: {
        flightNumber: createFlightDto.flightNumber,
        departureDateTime: new Date(createFlightDto.departureDateTime),
        arrivalDateTime: new Date(createFlightDto.arrivalDateTime),
        stopoverCount: createFlightDto.stopoverCount,
        airline: createFlightDto.airline,
        price: createFlightDto.price,
        flightDuration: createFlightDto.flightDuration,
        source: createFlightDto.source ?? 'Created',
        airportDepartureId: createFlightDto.airportDepartureId,
        airportArrivalId: createFlightDto.airportArrivalId,
      },
    });
  }

  public async searchFlight (){
    
  }

}
