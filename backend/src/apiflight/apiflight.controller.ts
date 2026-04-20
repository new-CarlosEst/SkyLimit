import { Controller, Get, Query } from '@nestjs/common';
import { ApiflightService } from './apiflight.service';

@Controller('apiflight')
export class ApiflightController {
  constructor(private readonly apiflightService: ApiflightService) {}

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
    //TODO: Devolver este metodo para devolver resultados reales
    //return this.apiflightService.getFlightsRoundTrip(originName, destinationName, origin, departure, cabinClass, date, returnDate, adults, children, infants);

    //LLamo a un metodo con datos de mock de una peticion exitosa que realize para no gastar tokens en proximas pruebas
    return this.apiflightService.getFlightsRoundTripMock();
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
    //TODO: Devolver este metodo para devolver resultados reales
    //return this.apiflightService.getFlightsOneWay(originName, destinationName, origin, departure, cabinClass, date, adults, children, infants);

    //LLamo a un metodo con datos de mock de una peticion exitosa que realize para no gastar tokens en proximas pruebas
    return this.apiflightService.getFlightsOneWayMock();
  }

  @Get('multi')
  async getFlightsMulti(
    @Query('legs') legs: string,
    @Query('cabinClass') cabinClass: string,
    @Query('adults') adults: string,
  ) {
    //Parseo el string JSON de legs a array de objetos
    const legsArray = JSON.parse(legs);

    //TODO: Devolver este metodo para devolver resultados reales
    //return this.apiflightService.getFlightsMulti(legsArray, cabinClass, adults);

    //LLamo a un metodo con datos de mock de una peticion exitosa que realize para no gastar tokens en proximas pruebas
    return this.apiflightService.getFlightsMultiMock();
  }

  @Get('offers')
  async getFlightsOffers(
    @Query('originName') originName: string,
    @Query('originIATA') originIATA: string,
    @Query('cabinClass') cabinClass: string,
    @Query('adults') adults: string,
  ) {
    //TODO: Devolver este metodo para devolver resultados reales
    //return this.apiflightService.getBestOffers(originName, originIATA, cabinClass, adults);

    //LLamo a un metodo con datos de mock de una peticion exitosa que realize para no gastar tokens en proximas pruebas
    return this.apiflightService.getFlightsOffersMock();
  }
}
