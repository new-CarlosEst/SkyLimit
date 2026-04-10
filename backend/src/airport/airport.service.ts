import {
    Injectable,
    InternalServerErrorException,
    BadRequestException,
    NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Airport } from './entities/airport.entity';

@Injectable()
export class AirportService {

    constructor(private prisma: PrismaService) { }

    /** 
     * Metodo que devuelve los aeropuertos que coinciden con el nombre de forma parcial
     * @param name Nombre/coincidencias del aeropuerto/s a buscar
     * @returns Aeropuertos que coinciden con el nombre/coincidencias encontrados
     */
    public async searchAirportsByName(name: string): Promise<Airport[] | null> {
        try {
            //si el nombre viene vacio
            if (!name || name.trim() === '') {
                throw new BadRequestException('El nombre del aeropuerto no puede estar vacío');
            }

            return await this.prisma.airport.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: 'insensitive',
                    }
                }
            });

            //Caso interno del servidor
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error; // Re-lanzar error de validación
            }

            // Error de base de datos o conexión
            throw new InternalServerErrorException('Error al buscar aeropuerto por nombre');
        }
    }

    /**
     * Metodo que busca un aeropuerto por nombre exacto
     * @param name Nombre exacto del aeropuerto a buscar
     * @returns Aeropuerto encontrado o null si no existe
     */
    public async getAirportByName(name: string): Promise<Airport | null> {
        try {
            //si el nombre esta vacio
            if (!name || name.trim() === '') {
                throw new BadRequestException('El nombre del aeropuerto no puede estar vacío');
            }

            const airport = await this.prisma.airport.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    }
                }
            });

            //si no se encontro el aeropuerto
            if (!airport) {
                throw new NotFoundException('No se encontró ningún aeropuerto con ese nombre');
            }

            return airport;

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error; // Re-lanzar error de validación (400)
            }

            // Error de base de datos o conexión
            throw new Error(`DATABASE_ERROR: Error al buscar aeropuerto por nombre: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }

    public async getAirportByIATA(IATA: string): Promise<Airport | null> {
        try {
            //si el IATA esta vacio
            if (!IATA || IATA.trim() === '') {
                throw new BadRequestException('El IATA del aeropuerto no puede estar vacío');
            }

            const airport = await this.prisma.airport.findFirst({
                where: {
                    iata: {
                        equals: IATA,
                        mode: 'insensitive'
                    }
                }
            });

            //si no se encontro el aeropuerto
            if (!airport) {
                throw new NotFoundException('No se encontró ningún aeropuerto con ese IATA');
            }

            return airport;

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error; // Re-lanzar error de validación (400)
            }

            // Error de base de datos o conexión
            throw new Error(`DATABASE_ERROR: Error al buscar aeropuerto por IATA: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
}
