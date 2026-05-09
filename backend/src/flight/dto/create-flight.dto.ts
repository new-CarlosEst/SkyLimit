import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Matches } from 'class-validator';

export class CreateFlightDto {
  @IsString()
  flightNumber: string; // e.g. 'skylimit-123456'

  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, { message: 'departureDateTime must be in YYYY-MM-DDTHH:mm:SS format' })
  departureDateTime: string; // YYYY-MM-DDTHH:mm:SS

  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, { message: 'arrivalDateTime must be in YYYY-MM-DDTHH:mm:SS format' })
  arrivalDateTime: string; // YYYY-MM-DDTHH:mm:SS

  @IsOptional()
  @IsInt()
  @IsPositive()
  stopoverCount?: number;

  @IsString()
  airline: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  flightDuration?: number; // duración en minutos

  @IsOptional()
  @IsEnum(['Api', 'Created'], { message: 'source must be Api or Created' })
  source?: string; // "Api" | "Created"  (por defecto "Created" en BD)

  @IsInt()
  airportDepartureId: number;

  @IsInt()
  airportArrivalId: number;
}
