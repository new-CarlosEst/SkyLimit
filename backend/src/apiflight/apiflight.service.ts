import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CabinClass } from './enums/CabinClass';
import * as mockOneWay from './mockOneWay.json';
import * as mockRoundTrip from './mockRoundTrip.json';
import * as mockMulti from './mockMulti.json';
import * as mockOffers from './mockOffers.json';
import { AirportService } from '../airport/airport.service';
import {
  FlightEntity,
  LegEntity,
  StopoverEntity,
  AirportDetail,
} from './entities/flight.entity';

@Injectable()
export class ApiflightService {
  constructor(
    private readonly airportService: AirportService,
    private readonly configService: ConfigService,
  ) {}

  //Metodos que hacen la peticion a la api
  /**
   * Funcion que recibe los parametros de un vuelo de ida y vuelta y devuelve los resultados de la busqueda
   * @params originName: Nombre del aeropuerto de origen
   * @params destinationName: Nombre del aeropuerto de destino
   * @params originIATA: IATA del aeropuerto de origen
   * @params destinationIATA: IATA del aeropuerto de destino
   * @params cabinClass: Clase de la cabina en formato string
   * @params departureDate: Fecha de salida en formato string
   * @params returnDate: Fecha de vuelta en formato string
   * @params adults: Numero de adultos en formato string
   * @params children?: Numero de niños en formato string
   * @params infants?: Numero de bebes en formato string
   * @returns Resultados de la busqueda
   */
  public async getFlightsRoundTrip(
    originName: string,
    destinationName: string,
    originIATA: string,
    destinationIATA: string,
    cabinClass: string,
    departureDate: string,
    returnDate: string,
    adults: string,
    children?: string,
    infants?: string,
  ) {
    //Pido tanta los entityId de aeropuerto de ida como de vuelta
    const originEntityId = await this.getAirportIdByName(
      originName,
      originIATA,
    );
    const destinationEntityId = await this.getAirportIdByName(
      destinationName,
      destinationIATA,
    );

    //Verifico que la  clase del vuelo es valida
    const cabinClassVerified = this.verifyCabinClass(cabinClass);

    //Me hago el contendo de la peticion
    const options = {
      method: 'GET',
      url: 'https://skyscanner-flights-travel-api.p.rapidapi.com/flights/searchFlights',
      params: {
        originSkyId: originIATA,
        destinationSkyId: destinationIATA,
        originEntityId: originEntityId,
        destinationEntityId: destinationEntityId,
        date: departureDate,
        returnDate: returnDate,
        cabinClass: cabinClassVerified,
        adults: adults,
        childrens: children || '0', //Tanto children como infants en caso de que no se pase o se pase undefine tendran valor 0
        infants: infants || '0',
        currency: 'EUR',
        countryCode: 'ES',
        market: 'ES',
      },
      headers: {
        //todo: una vez hecho ya el testing o quedarse sin peticiones en esta usar la variable de entorno RAPID_API
        'x-rapidapi-key': this.configService.get<string>('RAPID_API_TEST'),
        'x-rapidapi-host': 'skyscanner-flights-travel-api.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Busca vuelos de ida
   * @params originName: Nombre del aeropuerto de origen
   * @params destinationName: Nombre del aeropuerto de destino
   * @params originIATA: Codigo IATA del aeropuerto de origen
   * @params destinationIATA: Codigo IATA del aeropuerto de destino
   * @params cabinClass: Clase de vuelo (economy, premium, business, first)
   * @params departureDate: Fecha de salida
   * @params adults: Número de adultos
   * @params children: Número de niños
   * @params infants: Número de infantes
   * @returns Promise<any> - Respuesta de la API de Skyscanner
   */
  public async getFlightsOneWay(
    originName: string,
    destinationName: string,
    originIATA: string,
    destinationIATA: string,
    cabinClass: string,
    departureDate: string,
    adults: string,
    children?: string,
    infants?: string,
  ) {
    //Pido tanta los entityId de aeropuerto de ida como de vuelta
    const originEntityId = await this.getAirportIdByName(
      originName,
      originIATA,
    );
    const destinationEntityId = await this.getAirportIdByName(
      destinationName,
      destinationIATA,
    );

    //Verifico que la  clase del vuelo es valida
    const cabinClassVerified = this.verifyCabinClass(cabinClass);

    //Me hago el contendo de la peticion
    const options = {
      method: 'GET',
      url: 'https://skyscanner-flights-travel-api.p.rapidapi.com/flights/searchFlights',
      params: {
        originSkyId: originIATA,
        destinationSkyId: destinationIATA,
        originEntityId: originEntityId,
        destinationEntityId: destinationEntityId,
        date: departureDate,
        cabinClass: cabinClassVerified,
        adults: adults,
        childrens: children || '0',
        infants: infants || '0',
        currency: 'EUR',
        countryCode: 'ES',
        market: 'ES',
      },
      headers: {
        //todo: una vez hecho ya el testing o quedarse sin peticiones en esta usar la variable de entorno RAPID_API
        'x-rapidapi-key': this.configService.get<string>('RAPID_API_TEST'),
        'x-rapidapi-host': 'skyscanner-flights-travel-api.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Busca vuelos con escalas múltiples
   * @params legs: Array de objetos con originSkyId, destinationSkyId y date
   * @params cabinClass: Clase de vuelo (economy, premium, business, first)
   * @params adults: Número de adultos
   * @returns Promise<any> - Respuesta de la API de Skyscanner
   */
  public async getFlightsMulti(
    legs: { originSkyId: string; destinationSkyId: string; date: string }[], //El originSkyId y destinationSkyId son los códigos IATA de los aeropuertos, y la fecha es el dia de el primer vuelo
    cabinClass: string,
    adults: string,
  ) {

    //Verifico que la  clase del vuelo es valida
    const cabinClassVerified = this.verifyCabinClass(cabinClass);

    //Convierto las legs a string JSON como espera la API
    const legsForApi = JSON.stringify(legs);


    const options = {
      method: 'GET',
      url: 'https://skyscanner-flights-travel-api.p.rapidapi.com/flights/searchFlightsMultiStops',
      params: {
        adults: adults,
        cabinClass: cabinClassVerified,
        currency: 'USD',
        legs: legsForApi
      },
      headers: {
        'x-rapidapi-key': this.configService.get<string>('RAPID_API_TEST'),
        'x-rapidapi-host': 'skyscanner-flights-travel-api.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    };
    
    try {
      const response = await axios.request(options);
      return await this.mapToFlightEntity(response.data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Funcion que recibe sitio de salida y te devuelve datos con ofertas a diferentes destinos, pero sin devolver datos de los vuelos
   * @params originName: Nombre del sitio de salida
   * @params originIATA: Codigo IATA del sitio de salida
   * @params cabinClass: Clase de vuelo (economy, premium, business, first)
   * @params adults: Numero de adultos
   * @returns Promise<any> - Respuesta de la API de Skyscanner
   */
  public async getBestOffers(
    originName: string,
    originIATA: string,
    cabinClass: string,
    adults: string,
  ) {
    //Saco el id de la entidad
    const originEntityId = await this.getAirportIdByName(
      originName,
      originIATA,
    );

    //Verifico que la  clase del vuelo es valida
    const cabinClassVerified = this.verifyCabinClass(cabinClass);
    
    //Hago la peticion con sus opciones 
    const options = {
      method: 'GET',
      url: 'https://skyscanner-flights-travel-api.p.rapidapi.com/flights/searchFlightEverywhere',
      params: {
        originSkyId: originIATA,
        originEntityId: originEntityId,
        cabinClass: cabinClassVerified,
        adults: adults,
        currency: 'EUR',
        market: 'ES',
      },
      headers: {
        //todo: una vez hecho ya el testing o quedarse sin peticiones en esta usar la variable de entorno RAPID_API
        'x-rapidapi-key': this.configService.get<string>('RAPID_API_TEST'),
        'x-rapidapi-host': 'skyscanner-flights-travel-api.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }


  }

  //TODO: Este metodo recibira el lugar de salida y destino (solo iata) y el mes y te dara las mejores opciones
  public async getFlightsBestPrice(
    originIATA: string,
    destinationIATA: string,
    month: string,
  ){


    const options = {
      method: 'GET',
      url: 'https://skyscanner-flights-travel-api.p.rapidapi.com/flights/getCheapestOneway',
      params: {
        destinationSkyId: destinationIATA,
        originSkyId: originIATA,
        market: 'ES',
        month: month,
        currency: 'EUR'
      },
      headers: {
        'x-rapidapi-key': this.configService.get<string>('RAPID_API_TEST') || '',
        'x-rapidapi-host': 'skyscanner-flights-travel-api.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    };

    //todo: hacer la peticion con axios (en rapidapi.com fallaba esta peticion, comprobar)
  }



  //Datos mock para pintar los datos en el front
  //TODO: No usarlos cuando ya la peticion de vuelos en front este montada bien
  /**
   * Funcion que devuelve los resultados de la busqueda de solo ida mockeados
   * @returns Resultados de la busqueda mockeados mapeados a FlightEntity
   */
  public async getFlightsOneWayMock(): Promise<FlightEntity[]> {
    return await this.mapToFlightEntity(mockOneWay);
  }

  /**
   * Funcion que devuelve los resultados de la busqueda de ida y vuelta mockeados
   * @returns Resultados de la busqueda mockeados mapeados a FlightEntity
   */
  public async getFlightsRoundTripMock(): Promise<FlightEntity[]> {
    return await this.mapToFlightEntity(mockRoundTrip);
  }
  /**
   * Funcion que devuelve los resultados de la busqueda de multiples destinos mockeados
   * @returns Resultados de la busqueda mockeados mapeados a FlightEntity
   */
  public async getFlightsMultiMock(): Promise<FlightEntity[]> {
    return await this.mapToFlightEntity(mockMulti);
  }

  /**
   * Funcion que devuelve los resultados de la busqueda de ofertas mockeados
   * @returns Resultados de la busqueda mockeados
   */
  public async getFlightsOffersMock() {
    return mockOffers;
  }



  //Funciones extra que aportan datos y formateo a las peticiones

  /**
   * Funcion que recibe el nombre de un aeropuerto y su IATA y devuelve su entityId consultando la API de Skyscanner
   * @params name: string - Nombre del aeropuerto
   * @params IATA: string - IATA del aeropuerto
   * @returns string - EntityId del aeropuerto
   */
  private async getAirportIdByName(name: string, IATA: string) {
    const options = {
      method: 'GET',
      url: 'https://skyscanner-flights-travel-api.p.rapidapi.com/flights/searchAirport',
      params: { query: name },
      headers: {
        //TODO: Una vez termiando el testing usar RAPID_API_TEST
        'x-rapidapi-key': this.configService.get<string>('RAPID_API_TEST'),
        'x-rapidapi-host': 'skyscanner-flights-travel-api.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.request(options);

      const airport = response.data.places.find(
        (airport: any) => airport.skyId === IATA,
      );

      if (!airport) {
        throw new HttpException(
          `Aeropuerto ${name} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      return airport.entityId;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Funcion que recibe en forma de string la clase de una cabina y devuelve su enum
   * @params cabinClass: string - Clase de la cabina en formato string
   * @returns CabinClass - Clase de la cabina en formato enum
   */
  public verifyCabinClass(cabinClass: string): CabinClass {
    switch (cabinClass.toLowerCase()) {
      case 'economy':
        return CabinClass.ECONOMY;
      case 'premium economy':
        return CabinClass.PREMIUM_ECONOMY;
      case 'premium_economy':
        return CabinClass.PREMIUM_ECONOMY;
      case 'business':
        return CabinClass.BUSINESS;
      case 'first':
        return CabinClass.FIRST;
      default:
        throw new HttpException(
          `Clase de cabina inválida: ${cabinClass}. Las opciones válidas son: economy, premiumeconomy, business, first`,
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  /**
   * Funcion que mapea la respuesta de la API de Skyscanner a una entidad de vuelo propia
   * @params apiResponse: Response de la API de Skyscanner
   * @returns Array de FlightEntity - Lista de vuelos mapeados
   */
  private async mapToFlightEntity(apiResponse: any): Promise<FlightEntity[]> {
    const itineraries = apiResponse.itineraries || [];

    //Mapea los datos de la respuesta para devolver algo mas legible y con menos datos
    const mappedItineraries = await Promise.all(
      itineraries.map(async (itinerary: any) => {
        const legs = await Promise.all(
          itinerary.legs.map(async (leg: any) => {
            // Obtengo los datos del aeropuerto de origen y destino por su IATA consultando mi propia base de datos
            const originDetail = await this.airportService.getAirportByIATA(
              leg.origin,
            );
            const destinationDetail =
              await this.airportService.getAirportByIATA(leg.destination);

            //Devuelve la entidad LegEntity con datos mapeados sobre los vuelos, en ida solo habria un leg y en vuelta dos
            const legEntity: LegEntity = {
              origin: {
                iata: leg.origin,
                name: originDetail?.name || 'Unknown',
                city: originDetail?.city || 'Unknown',
                country: originDetail?.country || 'Unknown',
              },
              destination: {
                iata: leg.destination,
                name: destinationDetail?.name || 'Unknown',
                city: destinationDetail?.city || 'Unknown',
                country: destinationDetail?.country || 'Unknown',
              },
              departure: leg.departure,
              arrival: leg.arrival,
              durationMinutes: leg.durationMinutes,
              stopCount: leg.stopCount,
              carriers: leg.carriers.map((c: any) => ({
                name: c.name,
                logoUrl: c.logoUrl,
              })),
            };
            return legEntity;
          }),
        );

        const flightEntity: FlightEntity = {
          id: itinerary.id,
          price: {
            amount: itinerary.price.amount,
            currency: itinerary.price.currency,
            formatted: itinerary.price.formatted,
          },
          legs: legs,
        };
        return flightEntity;
      }),
    );

    return mappedItineraries;
  }

}

