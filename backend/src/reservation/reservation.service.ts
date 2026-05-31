import { Injectable, BadRequestException } from '@nestjs/common';
import { FareType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FlightService } from '../flight/flight.service';
import { SaveFlightsDto } from './dto/save-flight.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    private readonly flightService: FlightService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Guarda múltiples vuelos en la base de datos
   * Verifica si cada vuelo ya existe (source = Created), si no lo guarda con source = Api
   * @param saveFlightsDto DTO con el tipo de viaje y los vuelos a guardar
   * @returns Array con los vuelos guardados o existentes
   */
  public async saveFlights(saveFlightsDto: SaveFlightsDto): Promise<any[]> {
    const { flights } = saveFlightsDto;

    if (!flights || flights.length === 0) {
      throw new BadRequestException('No se proporcionaron vuelos para guardar');
    }

    const savedFlights: any[] = [];

    for (const flightDto of flights) {
      const flight = await this.flightService.saveSingleFlight(flightDto);
      savedFlights.push(flight);
    }

    return savedFlights;
  }

  public async createReservation(
    createReservationDto: CreateReservationDto,
    userId: number,
  ) {
    const { passengers, selectedFlight } = createReservationDto;

    if (!passengers?.length) {
      throw new BadRequestException('Debe existir al menos un pasajero');
    }

    if (!selectedFlight?.legs?.length) {
      throw new BadRequestException('No se recibieron tramos de vuelo');
    }

    const resolvedFlightIds = await this.resolveFlightIds(selectedFlight);

    const reservation = await this.prisma.reservation.create({
      data: {
        status: 'PENDING_PAYMENT',
        travelClass: createReservationDto.travelClass,
        price: createReservationDto.totalPrice,
        userId,
        reservationFlights: {
          create: resolvedFlightIds.map((flightId, index) => ({
            flightId,
            order: index + 1,
          })),
        },
      },
    });

    for (const passenger of passengers) {
      const createdPassenger = await this.prisma.passenger.create({
        data: {
          name: passenger.name,
          surname: passenger.surname,
          nationality: passenger.nationality,
          gender: passenger.gender,
          birthDate: new Date(passenger.birthDate),
          email: passenger.email || '',
          phone: passenger.phone || '',
          reservations: {
            connect: { id: reservation.id },
          },
          documents: {
            create: {
              number: passenger.document.number,
              type: passenger.document.type,
              country: passenger.document.country,
              expirationDate: new Date(passenger.document.expirationDate),
            },
          },
        },
      });

      if (passenger.seat?.seatNumber) {
        await this.prisma.seat.create({
          data: {
            seatNumber: passenger.seat.seatNumber,
            cabin: passenger.seat.cabin,
            fareType: createReservationDto.fareType as FareType,
            price: passenger.seat.price ?? 0,
            reservationId: reservation.id,
            passengerId: createdPassenger.id,
          },
        });
      }
    }

    return {
      success: true,
      reservationId: reservation.id,
      status: reservation.status,
      totalPrice: reservation.price,
      message: 'Reserva creada correctamente',
    };
  }

  private async resolveFlightIds(
    selectedFlight: CreateReservationDto['selectedFlight'],
  ): Promise<number[]> {
    const dbIds = this.extractDbFlightIds(selectedFlight.id);
    if (dbIds.length > 0) {
      return dbIds;
    }

    const generatedPricePerLeg = selectedFlight.price.amount / selectedFlight.legs.length;
    const generatedFlights: number[] = [];

    for (const leg of selectedFlight.legs) {
      const generatedFlight = await this.flightService.saveSingleFlight({
        flightNumber: `API-${leg.origin.iata}-${leg.destination.iata}-${new Date(
          leg.departure,
        ).getTime()}`,
        departureDateTime: leg.departure,
        arrivalDateTime: leg.arrival,
        stopoverCount: leg.stopCount,
        airline: leg.carriers?.[0]?.name || 'Unknown',
        price: generatedPricePerLeg,
        flightDuration: leg.durationMinutes,
        airportDepartureIATA: leg.origin.iata,
        airportArrivalIATA: leg.destination.iata,
      });

      generatedFlights.push(generatedFlight.id);
    }

    return generatedFlights;
  }

  private extractDbFlightIds(flightId: string): number[] {
    if (!flightId?.startsWith('db-')) {
      return [];
    }

    return flightId
      .replace('db-', '')
      .split('-')
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0);
  }

  public async getUserReservations(userId: number) {
    const reservations = await this.prisma.reservation.findMany({
      where: {
        userId,
      },
      include: {
        reservationFlights: {
          include: {
            flight: {
              include: {
                airportDeparture: true,
                airportArrival: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        passengers: {
          include: {
            documents: true,
            seat: true,
          },
        },
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        reservationDate: 'desc',
      },
    });

    return reservations;
  }
}
