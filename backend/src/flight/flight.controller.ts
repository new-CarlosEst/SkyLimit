import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FlightService } from './flight.service';
import { CreateFlightDto } from './dto/create-flight.dto';

@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) { }

  @Post('/create')
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.createFlight(createFlightDto);
  }
}
