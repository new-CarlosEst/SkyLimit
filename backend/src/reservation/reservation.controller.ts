import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  Query,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { SaveFlightsDto } from './dto/save-flight.dto';
import { AuthService } from '../auth/auth.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservation')
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly authService: AuthService,
  ) {}

  /**
   * Endpoint para guardar múltiples vuelos en la base de datos
   * Verifica si cada vuelo ya existe (source = Created), si no lo guarda con source = Api
   * @param authHeader Header Authorization con el token JWT
   * @param saveFlightsDto DTO con el tipo de viaje y los vuelos a guardar
   * @returns Array con los vuelos guardados o existentes
   */
  @Post('save-flights')
  @HttpCode(200)
  public async saveFlights(
    @Headers('Authorization') authHeader: string,
    @Body() saveFlightsDto: SaveFlightsDto,
  ) {
    // Validar el token
    const token = authHeader.split(' ')[1];
    await this.authService.validateJWT(token);

    // Guardar los vuelos
    return this.reservationService.saveFlights(saveFlightsDto);
  }

  @Post('create')
  @HttpCode(201)
  public async createReservation(
    @Headers('Authorization') authHeader: string,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('No autorizado');
    }

    const token = authHeader.split(' ')[1];
    const validated = (await this.authService.validateJWT(token)) as any;
    return this.reservationService.createReservation(
      createReservationDto,
      validated.user.id,
    );
  }

  @Get('user')
  @HttpCode(200)
  public async getUserReservations(
    @Query('userId') userId: number,
  ) {
    return this.reservationService.getUserReservations(userId);
  }
}
