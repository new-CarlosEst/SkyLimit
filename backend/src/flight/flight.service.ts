import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { AirportService } from '../airport/airport.service';
import { 
  SearchOneWayDto, 
  SearchRoundTripDto, 
  SearchMultiDto, 
  SearchFlightByAirportsAndDateDto 
} from './dto/search-flight.dto';
import { FlightEntity, LegEntity } from '../apiflight/entities/flight.entity';


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

    // Ajustar fechas para considerar zona horaria local
    // El frontend envía fechas en hora local (España UTC+2), pero new Date() las interpreta como UTC
    // Agregamos 2 horas para compensar la diferencia de zona horaria
    const departureDate = new Date(createFlightDto.departureDateTime);
    const arrivalDate = new Date(createFlightDto.arrivalDateTime);
    
    // Compensar zona horaria UTC+2 (España en verano)
    departureDate.setHours(departureDate.getHours() + 2);
    arrivalDate.setHours(arrivalDate.getHours() + 2);

    return this.prisma.flight.create({
      data: {
        flightNumber: createFlightDto.flightNumber,
        departureDateTime: departureDate,
        arrivalDateTime: arrivalDate,
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

  // Métodos de búsqueda de vuelos

  /**
   * Busca vuelos de ida (oneWay)
   */
  public async searchOneWayFlights(searchOneWayDto: SearchOneWayDto): Promise<FlightEntity[]> {
    const { originIATA, destinationIATA, departureDate } = searchOneWayDto;
    
    const dbFlights = await this.searchFlightsByAirportsAndDate({
      originIATA,
      destinationIATA,
      date: departureDate
    });

    return dbFlights.map(f => this.createFlightEntityFromLegs([f]));
  }

  /**
   * Busca vuelos de ida y vuelta (roundTrip)
   */
  public async searchRoundTripFlights(searchRoundTripDto: SearchRoundTripDto): Promise<FlightEntity[]> {
    const { originIATA, destinationIATA, departureDate, returnDate } = searchRoundTripDto;
    
    const outboundFlights = await this.searchFlightsByAirportsAndDate({
      originIATA,
      destinationIATA,
      date: departureDate
    });

    const returnFlights = await this.searchFlightsByAirportsAndDate({
      originIATA: destinationIATA,
      destinationIATA: originIATA,
      date: returnDate
    });

    const results: FlightEntity[] = [];
    
    // Combinar cada ida con cada vuelta encontrada
    for (const outbound of outboundFlights) {
      for (const ret of returnFlights) {
        results.push(this.createFlightEntityFromLegs([outbound, ret]));
      }
    }
    
    return results;
  }

  /**
   * Busca vuelos con múltiples destinos (multi-destino)
   */
  public async searchMultiFlights(searchMultiDto: SearchMultiDto): Promise<FlightEntity[]> {
    const { legs } = searchMultiDto;
    
    const legsFlights: any[][] = [];
    
    // Buscar vuelos para cada leg
    for (const leg of legs) {
      const flights = await this.searchFlightsByAirportsAndDate({
        originIATA: leg.originSkyId,
        destinationIATA: leg.destinationSkyId,
        date: leg.date
      });
      
      if (flights.length === 0) return []; // Si falta una leg, no hay viaje completo
      legsFlights.push(flights);
    }

    // Generar combinaciones (simplificado: solo la primera combinación o todas)
    // Para no complicar, si hay vuelos en todas las legs, devolvemos una combinación por ahora
    // o podríamos devolver todas las permutaciones, pero con "Created" suele haber pocas.
    
    const results: FlightEntity[] = [];
    
    const combine = (index: number, currentLegs: any[]) => {
      if (index === legsFlights.length) {
        results.push(this.createFlightEntityFromLegs(currentLegs));
        return;
      }
      for (const flight of legsFlights[index]) {
        combine(index + 1, [...currentLegs, flight]);
      }
    };

    combine(0, []);
    return results;
  }

  /**
   * Método principal que delega a los 3 métodos de búsqueda según el tipo
   */
  public async searchFlightsByType(searchType: 'oneWay' | 'roundTrip' | 'multi', searchParams: any): Promise<FlightEntity[]> {
    switch (searchType) {
      case 'oneWay':
        return this.searchOneWayFlights(searchParams);
      case 'roundTrip':
        return this.searchRoundTripFlights(searchParams);
      case 'multi':
        return this.searchMultiFlights(searchParams);
      default:
        throw new NotFoundException(`Tipo de búsqueda no válido: ${searchType}`);
    }
  }

  /**
   * Busca vuelos en la base de datos por aeropuertos y fecha
   */
  private async searchFlightsByAirportsAndDate(params: SearchFlightByAirportsAndDateDto): Promise<any[]> {
    const { originIATA, destinationIATA, date } = params;
    
    const [originAirport, destinationAirport] = await Promise.all([
      this.airportService.getAirportByIATA(originIATA),
      this.airportService.getAirportByIATA(destinationIATA)
    ]);

    if (!originAirport || !destinationAirport) return [];

    const searchDate = new Date(date);
    // Ajustar la fecha para usar la zona horaria local del servidor
    // Compensar zona horaria UTC+2 (España en verano)
    const startDate = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate(), 0, 0, 0);
    const endDate = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate(), 23, 59, 59, 999);
    
    // Compensar zona horaria UTC+2
    startDate.setHours(startDate.getHours() + 2);
    endDate.setHours(endDate.getHours() + 2);

    return this.prisma.flight.findMany({
      where: {
        airportDepartureId: originAirport.id,
        airportArrivalId: destinationAirport.id,
        departureDateTime: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        airportDeparture: true,
        airportArrival: true
      }
    });
  }

  /**
   * Crea una FlightEntity a partir de uno o más vuelos (legs)
   */
  private createFlightEntityFromLegs(flights: any[]): FlightEntity {
    const legs: LegEntity[] = flights.map(flight => ({
      origin: {
        iata: flight.airportDeparture.iata,
        name: flight.airportDeparture.name,
        city: flight.airportDeparture.city,
        country: flight.airportDeparture.country,
      },
      destination: {
        iata: flight.airportArrival.iata,
        name: flight.airportArrival.name,
        city: flight.airportArrival.city,
        country: flight.airportArrival.country,
      },
      departure: flight.departureDateTime.toISOString(),
      arrival: flight.arrivalDateTime.toISOString(),
      durationMinutes: flight.flightDuration,
      stopCount: flight.stopoverCount || 0,
      carriers: [{
        name: flight.airline,
        logoUrl: '' 
      }],
    }));

    const totalPrice = flights.reduce((sum, f) => sum + f.price, 0);
    const id = flights.map(f => f.id).join('-');

    return {
      id: `db-${id}`,
      price: {
        amount: totalPrice,
        currency: 'EUR',
        formatted: `${totalPrice.toFixed(2)}€`
      },
      legs
    };
  }


}
