import { Query, Controller, Get, HttpCode } from '@nestjs/common';
import { AirportService } from './airport.service';

@Controller('airport') // ruta /airport
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get('search')
  @HttpCode(200)
  //Para peticiones get hacer un query, no un body
  async searchAiports(@Query('name') name: string) {
    return this.airportService.searchAirportsByName(name);
  }

  @Get('searchByIATA')
  @HttpCode(200)
  async searchAiportsByIATA(@Query('IATA') IATA: string) {
    return this.airportService.getAirportByIATA(IATA);
  }
}
