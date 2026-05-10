import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';

export class SearchOneWayDto {
  @IsString()
  originIATA: string;

  @IsString()
  destinationIATA: string;

  @IsString()
  departureDate: string; // Formato: YYYY-MM-DD

  @IsString()
  cabinClass: string;

  @IsString()
  adults: string;

  @IsOptional()
  @IsString()
  children?: string;

  @IsOptional()
  @IsString()
  infants?: string;
}

export class SearchRoundTripDto {
  @IsString()
  originIATA: string;

  @IsString()
  destinationIATA: string;

  @IsString()
  departureDate: string; // Formato: YYYY-MM-DD

  @IsString()
  returnDate: string; // Formato: YYYY-MM-DD

  @IsString()
  cabinClass: string;

  @IsString()
  adults: string;

  @IsOptional()
  @IsString()
  children?: string;

  @IsOptional()
  @IsString()
  infants?: string;
}

export class LegDto {
  @IsString()
  originSkyId: string;

  @IsString()
  destinationSkyId: string;

  @IsString()
  date: string; // Formato: YYYY-MM-DD
}

export class SearchMultiDto {
  @IsArray()
  legs: LegDto[];

  @IsString()
  cabinClass: string;

  @IsString()
  adults: string;

  @IsOptional()
  @IsString()
  children?: string;

  @IsOptional()
  @IsString()
  infants?: string;
}

export class SearchFlightByAirportsAndDateDto {
  @IsString()
  originIATA: string;

  @IsString()
  destinationIATA: string;

  @IsString()
  date: string; // Formato: YYYY-MM-DD
}
