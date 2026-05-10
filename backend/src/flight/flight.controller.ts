import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { FlightService } from './flight.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { 
  SearchOneWayDto, 
  SearchRoundTripDto, 
  SearchMultiDto 
} from './dto/search-flight.dto';

@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) { }

  @Post('/create')
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.createFlight(createFlightDto);
  }

  @Get('/search')
  async searchFlights(
    @Query('type') searchType: 'oneWay' | 'roundTrip' | 'multi',
    @Query() searchParams: any
  ) {
    return this.flightService.searchFlightsByType(searchType, searchParams);
  }

  @Get('/search/oneWay')
  async searchOneWay(@Query() searchOneWayDto: SearchOneWayDto) {
    return this.flightService.searchOneWayFlights(searchOneWayDto);
  }

  @Get('/search/roundTrip')
  async searchRoundTrip(@Query() searchRoundTripDto: SearchRoundTripDto) {
    return this.flightService.searchRoundTripFlights(searchRoundTripDto);
  }

  @Get('/search/multi')
  async searchMulti(@Query() searchMultiDto: SearchMultiDto) {
    return this.flightService.searchMultiFlights(searchMultiDto);
  }
}
