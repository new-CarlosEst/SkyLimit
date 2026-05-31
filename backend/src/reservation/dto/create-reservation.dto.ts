import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class SelectedFlightAirportDto {
  @IsString()
  iata: string;
}

class SelectedFlightCarrierDto {
  @IsString()
  name: string;
}

class SelectedFlightLegDto {
  @ValidateNested()
  @Type(() => SelectedFlightAirportDto)
  origin: SelectedFlightAirportDto;

  @ValidateNested()
  @Type(() => SelectedFlightAirportDto)
  destination: SelectedFlightAirportDto;

  @IsString()
  departure: string;

  @IsString()
  arrival: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stopCount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedFlightCarrierDto)
  carriers: SelectedFlightCarrierDto[];
}

class SelectedFlightPriceDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  amount: number;
}

class SelectedFlightDto {
  @IsString()
  id: string;

  @IsOptional()
  @IsIn(['Api', 'Created'])
  source?: 'Api' | 'Created';

  @ValidateNested()
  @Type(() => SelectedFlightPriceDto)
  price: SelectedFlightPriceDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedFlightLegDto)
  legs: SelectedFlightLegDto[];
}

class PassengerDocumentDto {
  @IsString()
  type: string;

  @IsString()
  number: string;

  @IsString()
  country: string;

  @IsString()
  expirationDate: string;
}

class PassengerSeatDto {
  @IsOptional()
  @IsString()
  seatNumber: string | null;

  @IsString()
  cabin: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;
}

class CreateReservationPassengerDto {
  @IsIn(['Adulto', 'Niño', 'Bebé'])
  type: 'Adulto' | 'Niño' | 'Bebé';

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  gender: string;

  @IsString()
  birthDate: string;

  @IsString()
  nationality: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @ValidateNested()
  @Type(() => PassengerDocumentDto)
  document: PassengerDocumentDto;

  @ValidateNested()
  @Type(() => PassengerSeatDto)
  seat: PassengerSeatDto;
}

export class CreateReservationDto {
  @IsString()
  travelClass: string;

  @IsIn(['BASIC', 'CLASSIC'])
  fareType: 'BASIC' | 'CLASSIC';

  @IsBoolean()
  checkedBag: boolean;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  baggagePricePerPassenger: number;

  @ValidateNested()
  @Type(() => SelectedFlightDto)
  selectedFlight: SelectedFlightDto;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReservationPassengerDto)
  passengers: CreateReservationPassengerDto[];
}

