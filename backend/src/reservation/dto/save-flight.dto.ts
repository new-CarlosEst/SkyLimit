import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

/**
 * DTO para guardar los datos de un vuelo en la base de datos
 */
export class SaveFlightDto {
  @IsString()
  flightNumber: string;

  @IsDateString()
  departureDateTime: string;

  @IsDateString()
  arrivalDateTime: string;

  @IsOptional()
  @IsNumber()
  stopoverCount?: number;

  @IsString()
  airline: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  flightDuration?: number;

  @IsString()
  airportDepartureIATA: string;

  @IsString()
  airportArrivalIATA: string;
}

/**
 * DTO para guardar múltiples vuelos en una reserva
 */
export class SaveFlightsDto {
  @IsString()
  each: 'oneWay' | 'roundTrip' | 'multi';

  flights: SaveFlightDto[];
}
