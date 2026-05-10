import { Controller, Get, Query } from '@nestjs/common';
import { ApiflightService } from './apiflight.service';
import { FlightService } from '../flight/flight.service';

@Controller('apiflight')
export class ApiflightController {
  constructor(
    private readonly apiflightService: ApiflightService,
    private readonly flightService: FlightService
  ) { }

  @Get('roundTrip')
  async getFlights(
    @Query('originName') originName: string,
    @Query('destinationName') destinationName: string,
    @Query('origin') origin: string,
    @Query('departure') departure: string,
    @Query('cabinClass') cabinClass: string,
    @Query('date') date: string,
    @Query('returnDate') returnDate: string,
    @Query('adults') adults: string,
    @Query('children') children?: string,
    @Query('infants') infants?: string,
  ) {
    // TODO: CAMBIAR A LA API REAL ANTES DE SUBIR A PRODUCCION
    const apiFlights = await this.apiflightService.getFlightsRoundTripMock();
    //const apiFlights = await this.apiflightService.getFlightsRoundTrip(originName, destinationName, origin, departure, cabinClass, date, returnDate, adults, children, infants);

    // Obtener vuelos de la base de datos interna
    const dbFlights = await this.flightService.searchRoundTripFlights({
      originIATA: origin,
      destinationIATA: departure,
      departureDate: date,
      returnDate: returnDate,
      cabinClass: cabinClass,
      adults: adults,
      children: children,
      infants: infants,
    });

    // Devolver ambos combinados (los de la BD primero)
    return [...dbFlights, ...apiFlights];
  }

  @Get('oneWay')
  async getFlightsOneWay(
    @Query('originName') originName: string,
    @Query('destinationName') destinationName: string,
    @Query('origin') origin: string,
    @Query('departure') departure: string,
    @Query('cabinClass') cabinClass: string,
    @Query('date') date: string,
    @Query('adults') adults: string,
    @Query('children') children?: string,
    @Query('infants') infants?: string,
  ) {
    // TODO: CAMBIAR A LA API REAL ANTES DE SUBIR A PRODUCCION
    const apiFlights = await this.apiflightService.getFlightsOneWayMock();
    //const apiFlights = await this.apiflightService.getFlightsOneWay(originName, destinationName, origin, departure, cabinClass, date, adults, children, infants);

    // Obtener vuelos de la base de datos interna
    const dbFlights = await this.flightService.searchOneWayFlights({
      originIATA: origin,
      destinationIATA: departure,
      departureDate: date,
      cabinClass: cabinClass,
      adults: adults,
      children: children,
      infants: infants,
    });

    return [...dbFlights, ...apiFlights];
  }

  @Get('multi')
  async getFlightsMulti(
    @Query('legs') legs: string,
    @Query('cabinClass') cabinClass: string,
    @Query('adults') adults: string,
  ) {
    const legsArray = JSON.parse(legs);

    // TODO: CAMBIAR A LA API REAL ANTES DE SUBIR A PRODUCCION
    //const apiFlights = await this.apiflightService.getFlightsMultiMock();
    const apiFlights = await this.apiflightService.getFlightsMulti(legsArray, cabinClass, adults);

    // Obtener vuelos de la base de datos interna
    const dbFlights = await this.flightService.searchMultiFlights({
      legs: legsArray,
      cabinClass: cabinClass,
      adults: adults,
    });

    return [...dbFlights, ...apiFlights];
  }

  @Get('offers')
  async getFlightsOffers(
    @Query('originName') originName: string,
    @Query('originIATA') originIATA: string,
    @Query('cabinClass') cabinClass: string,
    @Query('adults') adults: string,
  ) {
    // TODO: CAMBIAR A LA API REAL ANTES DE SUBIR A PRODUCCION Y HACER EL METODO BIEN (Usar el endpoint de la api de getPriceCalendar)
    // A este se le pasa iatas, cabin class, n adultos, y la fecha cogere del mes, dia y año actual a 3-4 meses vista.
    return this.apiflightService.getFlightsOffersMock();
  }
}
